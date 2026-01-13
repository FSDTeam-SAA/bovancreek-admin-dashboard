"use client"

import React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { driversAPI, vehiclesAPI } from "@/lib/api"
import { toast } from "sonner"

type Driver = {
  _id: string
  name: string
}

export function VehicleAssignDriverModal({
  open,
  onOpenChange,
  vehicle,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  vehicle: any | null
}) {
  const qc = useQueryClient()
  const [driverId, setDriverId] = React.useState("")

  const { data: driversRes, isLoading: driversLoading } = useQuery({
    queryKey: ["drivers", "all", 1, 200],
    queryFn: () => driversAPI.getAllDrivers(1, 200),
    enabled: open,
  })

  const drivers: Driver[] = driversRes?.data?.data ?? []

  React.useEffect(() => {
    if (!open) return
    const dId =
      typeof vehicle?.driverId === "object"
        ? vehicle.driverId?._id
        : vehicle?.driverId
    setDriverId(dId ?? "")
  }, [open, vehicle])

  const updateMutation = useMutation({
    mutationFn: (args: { id: string; data: FormData }) =>
      vehiclesAPI.updateVehicle(args.id, args.data),
    onSuccess: () => {
      toast.success("Driver updated")
      qc.invalidateQueries({ queryKey: ["vehicles"] })
      onOpenChange(false)
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Update failed"),
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!vehicle?._id) {
      toast.error("Missing vehicle id")
      return
    }
    if (!driverId) {
      toast.error("Select a driver")
      return
    }

    const fd = new FormData()
    fd.append("driverId", driverId)
    await updateMutation.mutateAsync({ id: vehicle._id, data: fd })
  }

  const isUpdating = updateMutation.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Driver</DialogTitle>
          <DialogDescription>Select a driver for this vehicle.</DialogDescription>
        </DialogHeader>

        {!vehicle ? (
          <div className="text-sm text-muted-foreground">
            No vehicle selected.
          </div>
        ) : (
          <form
            id="assign-driver-form"
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label>Assigned Driver</Label>
              <Select value={driverId} onValueChange={setDriverId}>
                <SelectTrigger>
                  <SelectValue
                    placeholder={driversLoading ? "Loading..." : "Assign a driver"}
                  />
                </SelectTrigger>
                <SelectContent>
                  {drivers.map((d) => (
                    <SelectItem key={d._id} value={d._id}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </form>
        )}

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={isUpdating}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="assign-driver-form"
            disabled={isUpdating || !vehicle || !driverId}
          >
            {isUpdating ? "Updating..." : "Update Driver"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
