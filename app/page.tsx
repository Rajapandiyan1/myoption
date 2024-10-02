'use client'
import { setNavActive } from "@/Store/NavActive";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function Home() {
  const NavActive=useDispatch();
  useEffect(()=>{
NavActive(setNavActive({active:"Home"}))
  },[])
  return (
    <h1>df</h1>
  );
}
