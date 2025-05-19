"use client";

import React, { useEffect } from "react";
import { Loader, PenBox, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { AddUserDialog } from "@/components/user/AddUserDialog";
// import DeleteUserDialog from "@/components/user/DeleteUserDialog";
import { User } from "@/types";
import EditUserDialog from "@/components/user/EditUserDialog";
import { useGetAllUsers } from "@/hooks/useUsers";



const columns: ColumnDef<User>[] = [
  {
    accessorKey: "firstName",
    header: "first Name",
  },
  {
    accessorKey: "lastName",
    header: "last Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    header: "Actions",
    cell: ({ row }) => {
      const user: User = row.original;
      return (
        <div className="flex gap-2">
          <EditUserDialog user={user} />
          {/* <DeleteUserDialog user={user} /> */}
        </div>
      );
    },
  },
];


export default function UsersPage() {
  const { data: userData, isPending: isUserPending } = useGetAllUsers();

  console.log("Mana unejeje Imitima yacu",userData);
  
  
  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Users</h1>
        <AddUserDialog />
      </div>
      {isUserPending ? (
        <div className="flex justify-center items-center">
          <Loader className="animate-spin h-5 w-5" />
        </div>
      ) : (
        //@ts-ignore
        <DataTable columns={columns} data={userData || []} />
      )}
    </div>
  );
}
