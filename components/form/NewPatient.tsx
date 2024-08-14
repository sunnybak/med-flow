"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { TextFormField } from "@/components/form/TextFormField";
import { NumericalFormField } from "@/components/form/NumericalFormField";
import { TextAreaFormField } from "@/components/form/TextAreaFormField";
import { PhoneFormField } from "@/components/form/PhoneFormField";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from "uuid";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import PuffLoader from "react-spinners/PuffLoader";

const newPatientFormSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    phone: z.string().min(1, "Phone number is required"),
    age: z.number().min(0, "Please enter in a number greater than 0"),
    location: z.string().min(1, "Location is required"),
    language: z.string().min(1, "Language is required"),
    chiefComplaint: z.string().min(1, "Please enter the main reason you seek medical care"),
});

type NewPatientFormValues = z.infer<typeof newPatientFormSchema>;

type NewPatientProps = {
    handleSubmit: (formData: Partial<NewPatientFormValues> & { patientId: string }) => void;
    submitting: boolean;
};

const defaultValues: Partial<NewPatientFormValues> = {
    firstName: "",
    lastName: "",
    phone: "",
    age: undefined,
    location: "",
    language: "",
    chiefComplaint: "",
};

export function NewPatient({ handleSubmit, submitting }: NewPatientProps) {
    const form = useForm<NewPatientFormValues>({
        resolver: zodResolver(newPatientFormSchema),
        defaultValues,
    });

    const [loading, setLoading] = React.useState(false);

    const getLocation = () => {
        setLoading(true); // Start loading
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const response = await fetch('/api/patient/location', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ latitude, longitude }),
                    });

                    const data = await response.json();

                    if (data.location) {
                        form.setValue("location", data.location);
                    } else {
                        alert("Location not found");
                    }
                } catch (error) {
                    console.error("Failed to fetch location data:", error);
                    alert("Failed to fetch location data");
                } finally {
                    setLoading(false);
                }
            }, () => {
                setLoading(false); // Stop loading on error
                alert("Failed to retrieve your location");
            });
        } else {
            alert("Geolocation is not supported by this browser.");
            setLoading(false); // Stop loading if geolocation is not supported
        }
    };

    const onSubmit = (data: NewPatientFormValues) => {
        console.log("Submitting data:", data);
        const patientId = uuidv4();

        const fullPatientData = {
            ...data,
            patientId,
        };

        console.log("Full patient data:", fullPatientData);
        handleSubmit(fullPatientData);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="flex flex-col md:flex-row md:space-x-4">
                    <div className="w-full md:w-1/2">
                        <TextFormField form={form} fieldName="firstName" fieldLabel="First Name" />
                    </div>
                    <div className="w-full md:w-1/2">
                        <TextFormField form={form} fieldName="lastName" fieldLabel="Last Name" />
                    </div>
                </div>
                <div className="flex flex-col md:flex-row md:space-x-4">
                    <div className="w-full md:w-1/4">
                        <NumericalFormField form={form} fieldName="age" fieldLabel="Age" />
                    </div>
                    <div className="w-full md:w-3/8">
                        <PhoneFormField form={form} fieldName="phone" fieldLabel="Phone Number" />
                    </div>
                    <div className="w-full md:w-3/8">
                        <TextFormField form={form} fieldName="language" fieldLabel="Language" />
                    </div>
                </div>

                <div className="flex w-full space-x-2">
                    <div className="flex-grow">
                        <TextFormField form={form} fieldName="location" fieldLabel="Location" className="w-full" />
                    </div>
                    <div className="flex items-end">
                        {loading ? (
                            <PuffLoader size={30} color="#FF5722" />
                        ) : (
                            <button
                                type="button"
                                onClick={getLocation}
                                className="text-white bg-black hover:bg-gray-700 focus:outline-none p-2 rounded h-10 w-10 flex items-center justify-center"
                            >
                                <MyLocationIcon style={{ fontSize: '1.5rem' }} />
                            </button>
                        )}
                    </div>
                </div>

                <TextAreaFormField form={form} fieldName="chiefComplaint" fieldLabel="Chief Complaint" />
                <div className="flex justify-center">
                    <Button type="submit" disabled={submitting}>
                        {submitting ? "Submitting..." : "Submit New Patient"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}

export default NewPatient;