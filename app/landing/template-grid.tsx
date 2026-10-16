// component.tsx
"use client";
import { ReactLenis } from "lenis/react";

export default function TemplateGrid() {
  return (
    <main className="bg-black">
      <section className="text-white   w-full bg-slate-950  ">
        <div className="grid grid-cols-12 gap-2">
          <div className="grid gap-2 col-span-4">
            <figure className=" w-full">
              <img
                src="img/sele11.jpg"
                alt="selection"
                className="transition-all duration-300 w-full h-96  align-bottom object-cover rounded-md "
              />
            </figure>
            <figure className=" w-full">
              <img
                src="img/sele10.jpg"
                alt="selection"
                className="transition-all duration-300 w-full h-96  align-bottom object-cover rounded-md "
              />
            </figure>
            <figure className=" w-full">
              <img
               src="img/sele9.jpg"
                alt="selection"
                className="transition-all duration-300 w-full h-96  align-bottom object-cover rounded-md "
              />
            </figure>
            <figure className="w-full">
              <img
               src="img/sele8.jpg"
                alt="selection"
                className="transition-all duration-300 w-full h-96  align-bottom object-cover rounded-md "
              />
            </figure>
            <figure className="w-full">
              <img
             src="img/sele7.jpg"
                alt="selection"
                className="transition-all duration-300 w-full h-96  align-bottom object-cover rounded-md "
              />
            </figure>
          </div>
          <div className="sticky top-0 h-screen w-full col-span-4 gap-2  grid grid-rows-3">
            <figure className="w-full h-full ">
              <img
                src="img/sele6.jpg"
                alt="selection"
                className="transition-all duration-300 h-full w-full  align-bottom object-cover rounded-md "
              />
            </figure>
            <figure className="w-full h-full ">
              <img
                src="img/new-icon.png"
                alt="logotype"
                className="transition-all duration-300 h-full w-full align-bottom object-contain rounded-md bg-white p-6 "
              />
            </figure>
            <figure className="w-full h-full ">
              <img
              src="img/sele4.jpg"
                alt="selection"
                className="transition-all duration-300 h-full w-full  align-bottom object-cover rounded-md "
              />
            </figure>
          </div>
          <div className="grid gap-2 col-span-4">
            <figure className="w-full">
              <img
                src="img/hero/hero1.jpg"
                alt="selection"
                className="transition-all duration-300 w-full h-96  align-bottom object-cover rounded-md "
              />
            </figure>
            <figure className="w-full">
              <img
                src="img/sele2.jpg"
                alt="selection"
                className="transition-all duration-300 w-full h-96  align-bottom object-cover rounded-md "
              />
            </figure>
            <figure className="w-full">
              <img
                 src="img/sele1.jpg"
                alt="selection"
                className="transition-all duration-300 w-full h-96  align-bottom object-cover rounded-md "
              />
            </figure>
            <figure className="w-full">
              <img
                 src="img/sele3.jpg"
                alt="selection"
                className="transition-all duration-300 w-full h-96  align-bottom object-cover rounded-md "
              />
            </figure>
            <figure className="w-full">
              <img
                src="img/sele5.jpg"
                alt="selection"
                className="transition-all duration-300 w-full h-96  align-bottom object-cover rounded-md "
              />
            </figure>
          </div>
        </div>
      </section>
    </main>
  );
}
