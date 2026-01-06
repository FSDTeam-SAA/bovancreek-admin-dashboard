"use client";

import React from "react";
import {
  Card as CardV,
  CardContent as CardContentV,
  CardHeader as CardHeaderV,
  CardTitle as CardTitleV,
} from "@/components/ui/card";
import { Plus, Edit2, Trash2, Image as ImageIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { vehiclesAPI } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/pagination";
import { VehicleFormModal } from "./VehicleFormModal";
import { VehicleDetailsModal } from "./VehicleDetailsModal";

type DocObj = { url?: string; public_id?: string };

function DocThumb({
  label,
  doc,
}: {
  label: string;
  doc?: DocObj | null;
}) {
  const url = doc?.url?.trim();

  if (!url) {
    return (
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-md border bg-muted/30">
          <ImageIcon className="h-4 w-4" />
        </span>
        <span>{label}: No file</span>
      </div>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-2 group"
      onClick={(e) => e.stopPropagation()}
      title={`Open ${label}`}
    >
      <div className="h-10 w-14 rounded-md overflow-hidden border bg-muted/20">
        {/* normal <img> is fine because Cloudinary is external */}
        <img
          src={url}
          alt={label}
          className="h-full w-full object-cover transition-transform group-hover:scale-[1.03]"
          loading="lazy"
        />
      </div>
      <div className="text-xs">
        <p className="font-medium group-hover:underline">{label}</p>
        <p className="text-muted-foreground truncate max-w-[140px]">
          {doc?.public_id || "View"}
        </p>
      </div>
    </a>
  );
}

export default function VehiclesPage() {
  const [page, setPage] = React.useState(1);
  const [openForm, setOpenForm] = React.useState(false);
  const [formMode, setFormMode] = React.useState<"create" | "edit">("create");
  const [currentVehicle, setCurrentVehicle] = React.useState<any | null>(null);
  const [openDetails, setOpenDetails] = React.useState(false);

  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["vehicles", page],
    queryFn: () => vehiclesAPI.getAllVehicles(page, 10),
  });

  const delMutation = useMutation({
    mutationFn: async (id: string) => vehiclesAPI.deleteVehicle(id),
    onSuccess: () => {
      toast.success("Vehicle deleted");
      qc.invalidateQueries({ queryKey: ["vehicles"] });
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Delete failed"),
  });

  const vehicles = data?.data?.data || [];
  const meta = data?.data?.meta || { totalPages: 1 };

  const onAdd = () => {
    setFormMode("create");
    setCurrentVehicle(null);
    setOpenForm(true);
  };

  const onEdit = (v: any) => {
    setFormMode("edit");
    setCurrentVehicle(v);
    setOpenForm(true);
  };

  const onCardClick = (v: any) => {
    setCurrentVehicle(v);
    setOpenDetails(true);
  };

  return (
    <div className="md:ml-64 p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Vehicle List</h1>
          <p className="text-gray-600 mt-1">
            Manage and monitor all registered vehicles
          </p>
        </div>

        <Button className="bg-[#96A1DB] hover:bg-[#556ff3]" onClick={onAdd}>
          <Plus size={20} />
          Add Vehicle
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <CardV key={i}>
                <CardContentV className="pt-6">
                  <Skeleton className="h-40 w-full" />
                </CardContentV>
              </CardV>
            ))
          : vehicles.map((vehicle: any) => (
              <CardV
                key={vehicle._id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => onCardClick(vehicle)}
              >
                <CardHeaderV>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitleV>{vehicle.regNum}</CardTitleV>
                      <p className="text-sm text-gray-600 mt-1 capitalize">
                        {vehicle.type}
                      </p>
                    </div>

                    <div
                      className="flex gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button size="sm" variant="ghost" onClick={() => onEdit(vehicle)}>
                        <Edit2 size={16} />
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="ghost" className="text-red-600">
                            <Trash2 size={16} />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogTitle>Delete Vehicle</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this vehicle?
                          </AlertDialogDescription>
                          <div className="flex gap-4 justify-end">
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-600 hover:bg-red-700"
                              onClick={() => delMutation.mutate(vehicle._id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </div>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeaderV>

                <CardContentV>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Capacity:</span>
                      <span className="font-medium">{vehicle.capacity} seats</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Driver:</span>
                      <span className="font-medium">
                        {vehicle.driverId?.name || "-"}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">MOT Date:</span>
                      <span className="font-medium">
                        {vehicle.motDate
                          ? new Date(vehicle.motDate).toLocaleDateString()
                          : "-"}
                      </span>
                    </div>

                    {/* ✅ Document previews */}
                    <div className="pt-2 border-t space-y-2">
                      <DocThumb
                        label="Fitness"
                        doc={vehicle.fitNessCertificate}
                      />
                      <DocThumb label="Insurance" doc={vehicle.insurance} />
                    </div>
                  </div>
                </CardContentV>
              </CardV>
            ))}
      </div>

      <Pagination
        currentPage={page}
        totalPages={meta.totalPages || 1}
        onPageChange={setPage}
      />

      {/* Modals */}
      <VehicleFormModal
        open={openForm}
        onOpenChange={setOpenForm}
        mode={formMode}
        initial={currentVehicle}
      />
      <VehicleDetailsModal
        open={openDetails}
        onOpenChange={setOpenDetails}
        vehicle={currentVehicle}
      />
    </div>
  );
}
