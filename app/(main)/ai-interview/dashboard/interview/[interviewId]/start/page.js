"use client"
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { useParams } from 'next/navigation'
import React, { useEffect ,useState} from 'react'
import QuestionSection from './_components/QuestionSection';
import RecordAnswerSection from './_components/RecordAnswerSection';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
const StartInterview = () => {

    const { interviewId } = useParams();
    const [interviewData, setInterviewData] = useState({});
    const [mockInterviewQuestion, setMockInterviewQuestion] = useState([]);
    const [activeQuestionIndex,setActiveQuestionIndex]=useState(0)


    useEffect(() => {
      GetInterviewDetails();
    }, [])
    
    const GetInterviewDetails = async () => {
        const result = await db.select().from(MockInterview).where(eq(MockInterview.mockId, interviewId))
        if (!result?.length) return

        const requestedCount = Number(process.env.NEXT_PUBLIC_NUMBER_OF_QUESTIONS || 5)
        const parsedQuestions = JSON.parse(result[0].jsonMockResp)
        const normalizedQuestions = Array.isArray(parsedQuestions)
            ? parsedQuestions.slice(0, requestedCount)
            : []

        setMockInterviewQuestion(normalizedQuestions)
        setInterviewData(JSON.parse(JSON.stringify(result[0])))
        console.log(normalizedQuestions)
    }

    return (
        <div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
                {/*Questions */}
                <QuestionSection mockInterviewQuestion={mockInterviewQuestion} activeQuestionIndex={activeQuestionIndex} setActiveQuestionIndex={setActiveQuestionIndex} />
                {/* Video/ Audio Recording*/}
                <RecordAnswerSection  mockInterviewQuestion={mockInterviewQuestion} activeQuestionIndex={activeQuestionIndex} interviewData={interviewData}/>
            </div>
            <div className="flex justify-end gap-6">
                {activeQuestionIndex>0&&<Button onClick={()=>{setActiveQuestionIndex((prev)=>{return (prev-1)}) }}>Previous Question</Button>}
                {activeQuestionIndex!=mockInterviewQuestion?.length-1 && <Button onClick={()=>{setActiveQuestionIndex((prev)=>{return (prev+1)}) }}>Next Question</Button>}
                <Link href={"/ai-interview/dashboard/interview/"+interviewData.mockId+"/feedback"} >{activeQuestionIndex==mockInterviewQuestion?.length-1 && <Button>End Interview</Button>}</Link>
            </div>
        </div>
    )
}

export default StartInterview