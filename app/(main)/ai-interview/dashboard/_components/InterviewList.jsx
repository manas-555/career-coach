"use client"
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { useUser } from '@clerk/nextjs'
import { desc, eq } from 'drizzle-orm'
import React, { useEffect, useState } from 'react'
import InterviewItemCard from './InterviewItemCard'

const InterviewList = () => {

    const { user, isLoaded } = useUser();
    const [InterviewList, setInterviewList] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (isLoaded && user) {
            GetInterviewList();
        }
    }, [user, isLoaded])


    const GetInterviewList = async () => {
        try {
            setLoading(true)
            const result = await db.select().from(MockInterview).where(eq(MockInterview.createdBy, user?.primaryEmailAddress.emailAddress)).orderBy(desc(MockInterview.id))
            console.log(result)
            setInterviewList(result)
        } catch (error) {
            console.error('Error fetching interviews:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <div>
                <h2 className='font-medium text-xl'>Previous Mock Interview</h2>

                {loading ? (
                    <div className='flex justify-center items-center py-8'>
                        <p className='text-muted-foreground'>Loading interviews...</p>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-3' >
                        {InterviewList && InterviewList.length > 0 ? (
                            InterviewList.map((interview, index) => (
                                <div key={interview.id}><InterviewItemCard interview={interview} /></div>
                            ))
                        ) : (
                            <p className='text-muted-foreground col-span-full'>No interviews yet. Create one to get started!</p>
                        )}
                    </div>
                )}
            </div>

        </>
    )
}

export default InterviewList