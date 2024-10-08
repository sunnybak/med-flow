// app/patient-info/dashboard/page.jsx
"use client";

import * as React from 'react';
import { useEffect, useState, useRef } from "react";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import EditIcon from "@mui/icons-material/Edit";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";

import { Button } from '@/components/ui/button';
import Tooltip from './Tooltip';
import './dashboard.css';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdownMenu";


import { CLINICS, PRIORITIES, SPECIALTIES, STATUS } from '@/data/data';
import Link from 'next/link';

export default function PatientTriage() {
  const [rows, setRows] = React.useState([]);
  const [users, setUsers] = React.useState([]);
  const [sortOrder, setSortOrder] = React.useState("newest");
  const [prioritySort, setPrioritySort] = React.useState("all");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [nameFilter, setNameFilter] = React.useState("all");

  const fetchRows = async () => {
    try {
      const response = await fetch("/api/patient/");
      const data = await response.json();
      setRows(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/user/");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.log(error);
    }
  };

  const sortAndFilterRows = (
      rows,
      dateOrder,
      priorityFilter,
      nameFilter,
      searchTerm
  ) => {
    let filteredRows = rows.filter((row) => {
      if (searchTerm) {
        return row.patientId.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return true;
    });

    if (nameFilter !== "all") {
      filteredRows = filteredRows.filter((row) => row.patientId === nameFilter);
    }

    if (priorityFilter !== "all") {
      filteredRows = filteredRows.filter(
          (row) => row.priority === priorityFilter
      );
    }

    let sortedRows = [...filteredRows].sort((a, b) => {
      const dateA = new Date(a.surgeryDate);
      const dateB = new Date(b.surgeryDate);
      return dateOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    return sortedRows;
  };

  useEffect(() => {
    const fetchAndSortRows = async () => {
      try {
        const response = await fetch("/api/patient/");
        const data = await response.json();
        const sortedAndFilteredData = sortAndFilterRows(
            data,
            sortOrder,
            prioritySort,
            nameFilter,
            searchTerm
        );
        setRows(sortedAndFilteredData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAndSortRows();
    fetchUsers();
  }, [sortOrder, prioritySort, nameFilter, searchTerm]);

  return (
      <>
        <div className="w-full relative dashboard-page">
          <div className="flex justify-between items-center py-3">
            {/* Update the href to point to /create-patient */}
            <Link
                href="/create-patient"
                className="flex items-center justify-center no-underline"
            >
              <div className="relative group">
                <PersonAddIcon
                    className="text-5xl rounded-full shadow p-3 bg-white group-hover:shadow-lg transition-all duration-300"
                    style={{
                      color: "currentColor",
                      transition: "color 0.15s ease-in-out",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.color = "#FF5722")}
                    onMouseOut={(e) => (e.currentTarget.style.color = "currentColor")}
                />
                <span className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap bg-white px-2 py-1 rounded shadow-lg">
                Add New Patient
              </span>
              </div>
            </Link>
            <h2
                className="flex-1 text-center font-bold"
                style={{ fontSize: "24px" }}
            >
              {/* Adjusted font size and added bold */}
              <span className="blue_gradient">Patient List</span>
            </h2>
            <div style={{ width: 48 }}>
              {" "}
              {/* Placeholder to balance the header visually */}
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {sortOrder !== "newest" && (
                <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center">
                  <EditIcon
                      className="mr-2 cursor-pointer"
                      onClick={() => console.log("Edit date filter")}
                  />
                  Date: {sortOrder === "oldest" ? "Oldest first" : "Newest first"}
                  <RemoveCircleIcon
                      className="ml-2 cursor-pointer"
                      onClick={() => setSortOrder("newest")}
                  />
                </div>
            )}
            {prioritySort !== "all" && (
                <div className="bg-green-100 text-green-800 px-2 py-1 rounded flex items-center">
                  <EditIcon
                      className="mr-2 cursor-pointer"
                      onClick={() => console.log("Edit priority filter")}
                  />
                  Priority: {prioritySort}
                  <RemoveCircleIcon
                      className="ml-2 cursor-pointer"
                      onClick={() => setPrioritySort("all")}
                  />
                </div>
            )}
            {searchTerm !== "" && (
                <div className="bg-purple-100 text-purple-800 px-2 py-1 rounded flex items-center">
                  <EditIcon
                      className="mr-2 cursor-pointer"
                      onClick={() => console.log("Edit patient name filter")}
                  />
                  Patient Name: {searchTerm}
                  <RemoveCircleIcon
                      className="ml-2 cursor-pointer"
                      onClick={() => setSearchTerm("")}
                  />
                </div>
            )}
            <div
                className="bg-red-100 text-red-800 px-2 py-1 rounded cursor-pointer"
                onClick={() => {
                  setSortOrder("newest");
                  setPrioritySort("all");
                  setSearchTerm("");
                }}
            >
              <DeleteSweepIcon className="mr-2" />
              Clear all filters
            </div>
          </div>
          <TableContainer component={Paper} style={{ maxHeight: '80vh', overflowY: 'auto' }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead className="MuiTableHead-root">
                <TableRow>
                  <TableCell align="left">Patient ID</TableCell>
                  <TableCell align="center">Last Name</TableCell>
                  <TableCell align="center">Age</TableCell>
                  <TableCell align="center">Location</TableCell>
                  <TableCell align="center">Language Spoken</TableCell>
                  <TableCell align="center">Chief Complaint</TableCell>


                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="h-8 w-full justify-start"
                        >
                          Priority
                          <KeyboardArrowDownIcon className="ml-2 h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuRadioGroup value={prioritySort} onValueChange={setPrioritySort}>
                          <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                          {PRIORITIES.map((priority) => (
                              <DropdownMenuRadioItem key={priority} value={priority}>{priority}</DropdownMenuRadioItem>
                          ))}
                        </DropdownMenuRadioGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  <TableCell align="center">Specialty</TableCell>
                  <TableCell align="center">Additional Notes</TableCell>
                  <TableCell align="center">Triaged By</TableCell>
                  <TableCell align="center">Doctor Assigned</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, index) => (
                    <TableRow
                        key={index}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell 
                        align="left"
                        style={{
                          maxWidth: '120px', 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis', 
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <Tooltip tooltipText={row.patientId}>
                          <a href={`/patient-overview/${row._id}`} className="block overflow-hidden text-ellipsis">
                            {row.patientId}
                          </a>
                        </Tooltip>
                      </TableCell>

                      <TableCell align="center" style={{ minWidth: '150px' }}>{row.lastName}</TableCell>
                      <TableCell align="center">{row.age || ''}</TableCell>
                      <TableCell align="center" style={{ minWidth: '150px' }}>{row.location}</TableCell>
                      <TableCell align="center">{row.language}</TableCell>
                      <TableCell align="center">{row.chiefComplaint}</TableCell>

                      {/* Status */}
                      <TableCell align="center">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline">{row.status ?? 'Not Started'}</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-46">
                              <DropdownMenuSeparator />
                              <DropdownMenuRadioGroup value={row.status} onValueChange={async (value) => {
                                try {
                                  await fetch('/api/patient/', {
                                    method: 'PATCH',
                                    headers: {
                                      'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                      _id: rows[index]["_id"],
                                      status: value,
                                    }),
                                  });
                                  const updatedRows = [...rows];
                                  updatedRows[index].status = value;
                                  setRows(updatedRows);
                                } catch (error) {
                                  console.log(error);
                                }
                              }}>
                                {STATUS.map((status) => (
                                    <DropdownMenuRadioItem key={status} value={status}>{status}</DropdownMenuRadioItem>
                                ))}
                              </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                          </DropdownMenu>
                      </TableCell>

                      {/* priority */}
                      <TableCell align="center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline">{row.priority}</Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-46">
                            <DropdownMenuSeparator />
                            <DropdownMenuRadioGroup value={row.priority} onValueChange={async (value) => {
                              try {
                                await fetch('/api/patient/', {
                                  method: 'PATCH',
                                  headers: {
                                    'Content-Type': 'application/json',
                                  },
                                  body: JSON.stringify({
                                    _id: rows[index]["_id"],
                                    priority: value,
                                  }),
                                });
                                const updatedRows = [...rows];
                                updatedRows[index].priority = value;
                                setRows(updatedRows);
                              } catch (error) {
                                console.log(error);
                              }
                            }}>
                              {PRIORITIES.map((priority) => (
                                  <DropdownMenuRadioItem key={priority} value={priority}>{priority}</DropdownMenuRadioItem>
                              ))}
                            </DropdownMenuRadioGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>

                      {/* specialty */}
                      <TableCell align="center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline">{row.specialty}</Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-46">
                            <DropdownMenuSeparator />
                            <DropdownMenuRadioGroup value={row.specialty} onValueChange={async (value) => {
                              try {
                                await fetch('/api/patient/', {
                                  method: 'PATCH',
                                  headers: {
                                    'Content-Type': 'application/json',
                                  },
                                  body: JSON.stringify({
                                    _id: rows[index]["_id"],
                                    specialty: value,
                                  }),
                                });
                                const updatedRows = [...rows];
                                updatedRows[index].specialty = value;
                                setRows(updatedRows);
                              } catch (error) {
                                console.log(error);
                              }
                            }}>
                              {SPECIALTIES.map((specialty) => (
                                  <DropdownMenuRadioItem key={specialty} value={specialty}>{specialty}</DropdownMenuRadioItem>
                              ))}
                            </DropdownMenuRadioGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                      <TableCell align="center">{row.notes}</TableCell>
                      <TableCell align="center">{row.triagedBy}</TableCell>
                      <TableCell align="center">{row.doctor}</TableCell>
                    </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </>
  );
}
