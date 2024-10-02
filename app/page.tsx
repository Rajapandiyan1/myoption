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
    <>
    <h1>df</h1>
    <p className="text-blue-900">Lorem ipsum dolor sit amet consectetur adipisicing elit. Et nisi vitae, quisquam hic debitis id fuga cum blanditiis ad, modi ipsa voluptatem non sit dolores mollitia aliquid, obcaecati libero deserunt?</p>
    </>
  );
}
