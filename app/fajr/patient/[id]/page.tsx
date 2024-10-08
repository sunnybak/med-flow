// app/fajr/patient/[id]/page.tsx
import { PatientForm } from "@/components/form/PatientForm";
import PatientSubmenu from "@/components/PatientSubmenu";
import React from "react";

export default function Home({params}: {params: {id: string}}) {
    return (
        <div className="w-full max-w-4xl mx-auto pb-16">
            <PatientSubmenu />
            <h1 className="text-3xl font-bold mb-8 text-center">Patient Information</h1>
            <div className="border border-gray-300 p-8 bg-white shadow rounded-lg">
                <PatientForm id={params.id} />
            </div>
        </div>
    );
}