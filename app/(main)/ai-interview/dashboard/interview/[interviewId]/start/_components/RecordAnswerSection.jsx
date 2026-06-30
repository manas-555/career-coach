"use client"

import Webcam from 'react-webcam'

import React, { useEffect, useState } from 'react'

import Image from 'next/image'

import { Button } from '@/components/ui/button'

import useSpeechToText from 'react-hook-speech-to-text'

import { Mic, StopCircle } from 'lucide-react'

import { toast } from 'react-toastify'

import { useUser } from '@clerk/nextjs'

import { saveUserAnswer } from '@/actions/record-answer'

const RecordAnswerSection = ({
  mockInterviewQuestion,
  activeQuestionIndex,
  interviewData
}) => {

  const [userAnswer, setUserAnswer] = useState("")
  const [recordingQuestionIndex, setRecordingQuestionIndex] = useState(null)
  const [loading, setLoading] = useState(false)

  const { user } = useUser()

  const {
    error,
    interimResult,
    isRecording,
    results,
    setResults,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false
  })


  useEffect(() => {

    results.map((result) => (
      setUserAnswer(prevAns => prevAns + result?.transcript)
    ))

  }, [results])


  useEffect(() => {

    if (userAnswer.length > 10 && !isRecording) {
      UpdateUserAnswer()
    }

    if (userAnswer.length < 10 && !isRecording) {
      setResults([])
      setUserAnswer("")
    }

  }, [userAnswer])


  const StartStopRecording = () => {
    if (isRecording) {
      stopSpeechToText()
    } else {
      setRecordingQuestionIndex(activeQuestionIndex)
      startSpeechToText()
    }
  }


  const UpdateUserAnswer = async () => {

    try {

      setLoading(true)

      const questionIndex = recordingQuestionIndex ?? activeQuestionIndex
      const result = await saveUserAnswer({

        mockIdRef: interviewData?.mockId,

        question: mockInterviewQuestion[questionIndex]?.question,

        correctAns: mockInterviewQuestion[questionIndex]?.answer,

        userAnswer: userAnswer,

        userEmail: user?.primaryEmailAddress?.emailAddress,
      })

      if (result.success) {

        toast.success("User Answer recorded successfully")

        setUserAnswer("")
        setRecordingQuestionIndex(null)
        setResults([])
      }

    } catch (error) {

      console.log(error)

      toast.error("Something went wrong")
    }

    finally {

      setLoading(false)
    }
  }


  return (

    <div className='flex flex-col items-center'>

      <div className='flex flex-col justify-center my-20 items-center bg-black rounded-lg p-5'>

        <Image
          src={'/webcam.png'}
          width={200}
          height={200}
          className='absolute'
          alt='webcam'
        />

        <Webcam
          style={{
            width: '100%',
            height: 300,
            zIndex: 10,
          }}
        />

      </div>


      <Button
        variant="outline"
        disabled={loading}
        className="my-10"
        onClick={StartStopRecording}
      >

        {isRecording ? (

          <h2 className='text-red-600 flex gap-2'>
            <StopCircle />
            Stop Recording
          </h2>

        ) : (

          <h2 className='flex gap-2'>
            <Mic />
            Record Answer
          </h2>

        )}

      </Button>

    </div>
  )
}

export default RecordAnswerSection