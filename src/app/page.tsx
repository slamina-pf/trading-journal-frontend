"use client";
import { useState } from 'react';
import { Box } from "@mui/material";
import HomePage from '@/public/HomePage'

export default function Home() {

  const [btn, setBtn]=useState(false)

  return (
    <Box sx={{
    }}>
      <HomePage/>
    </Box>
  );
}
