"use client"
import React, { useEffect } from 'react'
import Image from 'next/image'
import { UserButton } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'
import Link from 'next/link'


const Header = () => {

    const path = usePathname();
    useEffect(() => {
        console.log(path)
    }, [])

    return (
       <></>
    )
}

export default Header