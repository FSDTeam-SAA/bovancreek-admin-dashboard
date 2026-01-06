"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Upload,
  X,
  FileText,
  CheckCircle2,
  Truck,
  ExternalLink,
  Image as ImageIcon,
} from "lucide-react";
import { vehiclesAPI, driversAPI } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Types
export type Vehicle = {
  _id?: string;
  regNum: string;
  type: string;
  capacity: number;
  motDate?: string;
  insuranceExpire?: string;
  driverId?: { _id: string; name: string } | string;
  fitNessCertificate?: { url: string; public_id: string };
  insurance?: { url: string; public_id: string };
};

type Driver = {
  _id: string;
  name: string;
  email: string;
};

const BACKEND_KEYS = {
  insuranceDate: "insuranceExpire",
  fitnessFile: "fitNessCertificate",
  insuranceFile: "insurance",
} as const;

function toISOFromParts(d?: string, m?: string, y?: string) {
  if (!d || !m || !y) return undefined;
  const date = new Date(Date.UTC(parseInt(y), parseInt(m) - 1, parseInt(d)));
  return isNaN(date.getTime()) ? undefined : date.toISOString();
}

export function VehicleFormModal({
  open,
  onOpenChange,
  mode,
  initial,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  mode: "create" | "edit";
  initial?: Partial<Vehicle> | null;
}) {
  const qc = useQueryClient();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Form States
  const [regNum, setRegNum] = React.useState("");
  const [type, setType] = React.useState("");
  const [capacity, setCapacity] = React.useState("");
  const [driverId, setDriverId] = React.useState("");

  // Date States
  const [mot, setMot] = React.useState({ d: "", m: "", y: "" });
  const [ins, setIns] = React.useState({ d: "", m: "", y: "" });

  // Files (new uploads)
  const [fitnessFile, setFitnessFile] = React.useState<File | null>(null);
  const [insuranceFile, setInsuranceFile] = React.useState<File | null>(null);

  const { data: driversRes, isLoading: driversLoading } = useQuery({
    queryKey: ["drivers", "all", 1, 200],
    queryFn: () => driversAPI.getAllDrivers(1, 200),
    enabled: open,
  });

  const drivers: Driver[] = driversRes?.data?.data ?? [];

  React.useEffect(() => {
    if (!open) return;

    setRegNum(initial?.regNum ?? "");
    setType(initial?.type ?? "");
    setCapacity(
      typeof initial?.capacity === "number" ? String(initial.capacity) : ""
    );

    const dId =
      typeof initial?.driverId === "object"
        ? initial.driverId?._id
        : (initial?.driverId as string | undefined);
    setDriverId(dId ?? "");

    const parseDate = (iso?: string) => {
      if (!iso) return { d: "", m: "", y: "" };
      const dt = new Date(iso);
      return {
        d: String(dt.getUTCDate()).padStart(2, "0"),
        m: String(dt.getUTCMonth() + 1).padStart(2, "0"),
        y: String(dt.getUTCFullYear()),
      };
    };

    setMot(parseDate(initial?.motDate));
    setIns(parseDate(initial?.insuranceExpire));

    // reset new files on open
    setFitnessFile(null);
    setInsuranceFile(null);
  }, [open, initial]);

  const mutationOptions = {
    onSuccess: () => {
      toast.success(
        `Vehicle ${mode === "create" ? "added" : "updated"} successfully`
      );
      qc.invalidateQueries({ queryKey: ["vehicles"] });
      onOpenChange(false);
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Operation failed"),
  };

  const createMutation = useMutation({
    mutationFn: vehiclesAPI.createVehicle,
    ...mutationOptions,
  });

  const updateMutation = useMutation({
    mutationFn: (args: { id: string; data: FormData }) =>
      vehiclesAPI.updateVehicle(args.id, args.data),
    ...mutationOptions,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const fd = new FormData();
    fd.append("regNum", regNum.trim());
    fd.append("type", type);
    fd.append("capacity", capacity);
    if (driverId) fd.append("driverId", driverId);

    const motISO = toISOFromParts(mot.d, mot.m, mot.y);
    const insISO = toISOFromParts(ins.d, ins.m, ins.y);

    if (motISO) fd.append("motDate", motISO);
    if (insISO) fd.append(BACKEND_KEYS.insuranceDate, insISO);

    // Only append if user selected new files
    if (fitnessFile) fd.append(BACKEND_KEYS.fitnessFile, fitnessFile);
    if (insuranceFile) fd.append(BACKEND_KEYS.insuranceFile, insuranceFile);

    try {
      if (mode === "create") await createMutation.mutateAsync(fd);
      else if (initial?._id)
        await updateMutation.mutateAsync({ id: initial._id, data: fd });
      else toast.error("Missing vehicle id for update");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl p-0 overflow-hidden border-none shadow-2xl">
        <div className="bg-primary/5 p-6 border-b">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg text-primary-foreground">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold">
                  {mode === "create"
                    ? "Register New Vehicle"
                    : "Update Vehicle Details"}
                </DialogTitle>
                <DialogDescription>
                  Manage fleet assets and compliance documents.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <ScrollArea className="max-h-[70vh]">
          <form id="vehicle-form" onSubmit={handleSubmit} className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    General Information
                  </h4>
                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="regNum">Registration Number</Label>
                    <Input
                      id="regNum"
                      placeholder="e.g. ABC-1234"
                      value={regNum}
                      onChange={(e) => setRegNum(e.target.value.toUpperCase())}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Vehicle Type</Label>
                      <Select value={type} onValueChange={setType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="minibus">Minibus</SelectItem>
                          <SelectItem value="bus">Bus</SelectItem>
                          <SelectItem value="van">Van</SelectItem>
                          <SelectItem value="car">Car</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Capacity</Label>
                      <Input
                        type="number"
                        value={capacity}
                        onChange={(e) => setCapacity(e.target.value)}
                        placeholder="Seats"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Assigned Driver</Label>
                    <Select value={driverId} onValueChange={setDriverId}>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            driversLoading ? "Loading..." : "Assign a driver"
                          }
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
                </div>

                <div className="space-y-4 pt-4">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Compliance Dates
                  </h4>
                  <Separator />
                  <DatePickerGroup
                    label="MOT Expiry Date"
                    values={mot}
                    setValues={setMot}
                  />
                  <DatePickerGroup
                    label="Insurance Expiry Date"
                    values={ins}
                    setValues={setIns}
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Documents & Proofs
                </h4>
                <Separator />

                <UploadBox
                  title="Fitness Certificate"
                  file={fitnessFile}
                  setFile={setFitnessFile}
                  description="Upload valid PDF or Image of technical fitness."
                  existingUrl={initial?.fitNessCertificate?.url}
                />

                <UploadBox
                  title="Insurance Document"
                  file={insuranceFile}
                  setFile={setInsuranceFile}
                  description="Current insurance policy coverage document."
                  existingUrl={initial?.insurance?.url}
                />
              </div>
            </div>
          </form>
        </ScrollArea>

        <DialogFooter className="p-6 bg-secondary/30 border-t gap-3">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="vehicle-form"
            className="min-w-[140px] shadow-lg shadow-primary/20"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Processing..."
              : mode === "create"
              ? "Add Vehicle"
              : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Helper Components
function DatePickerGroup({
  label,
  values,
  setValues,
}: {
  label: string;
  values: { d: string; m: string; y: string };
  setValues: React.Dispatch<
    React.SetStateAction<{ d: string; m: string; y: string }>
  >;
}) {
  const days = Array.from({ length: 31 }, (_, i) =>
    String(i + 1).padStart(2, "0")
  );
  const months = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, "0")
  );
  const years = Array.from({ length: 10 }, (_, i) =>
    String(new Date().getFullYear() + i)
  );

  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium text-muted-foreground">
        {label}
      </Label>
      <div className="grid grid-cols-3 gap-2">
        <Select
          value={values.d}
          onValueChange={(d) => setValues({ ...values, d })}
        >
          <SelectTrigger className="h-9">
            <SelectValue placeholder="DD" />
          </SelectTrigger>
          <SelectContent>
            {days.map((d) => (
              <SelectItem key={d} value={d}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={values.m}
          onValueChange={(m) => setValues({ ...values, m })}
        >
          <SelectTrigger className="h-9">
            <SelectValue placeholder="MM" />
          </SelectTrigger>
          <SelectContent>
            {months.map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={values.y}
          onValueChange={(y) => setValues({ ...values, y })}
        >
          <SelectTrigger className="h-9">
            <SelectValue placeholder="YYYY" />
          </SelectTrigger>
          <SelectContent>
            {years.map((y) => (
              <SelectItem key={y} value={y}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function UploadBox({
  title,
  file,
  setFile,
  description,
  existingUrl,
}: {
  title: string;
  file: File | null;
  setFile: (f: File | null) => void;
  description: string;
  existingUrl?: string;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  const isImage = React.useMemo(() => {
    return !!file && file.type?.startsWith("image/");
  }, [file]);

  React.useEffect(() => {
    if (!file || !isImage) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file, isImage]);

  const effectiveUrl = previewUrl || existingUrl || null;
  const showImage = !!effectiveUrl && effectiveUrl.includes("http");

  return (
    <div className="space-y-2">
      <Label>{title}</Label>

      {/* Existing/Preview display */}
      {effectiveUrl ? (
        <div className="flex items-center justify-between gap-3 rounded-lg border p-3 bg-muted/10">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-12 w-16 rounded-md overflow-hidden border bg-background flex items-center justify-center">
              {showImage ? (
                <img
                  src={effectiveUrl}
                  alt={title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <FileText className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">
                {file?.name || (existingUrl ? "Existing file" : "Selected file")}
              </p>
              <p className="text-[11px] text-muted-foreground truncate">
                {file ? `${(file.size / 1024).toFixed(0)} KB • ${file.type}` : existingUrl}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                window.open(effectiveUrl, "_blank");
              }}
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              Open
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive/80"
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
                setPreviewUrl(null);
                if (inputRef.current) inputRef.current.value = "";
              }}
              title="Remove selected file"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : null}

      {/* Upload drop area */}
      <div
        onClick={() => inputRef.current?.click()}
        className={`relative group border-2 border-dashed rounded-xl p-6 transition-all cursor-pointer flex flex-col items-center justify-center gap-3 overflow-hidden
          ${
            file || existingUrl
              ? "border-green-500/50 bg-green-50/30"
              : "border-muted-foreground/20 hover:border-primary/50 hover:bg-primary/5"
          }`}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept="image/*,.pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        {!file && !existingUrl ? (
          <>
            <div className="p-3 bg-secondary rounded-full text-muted-foreground group-hover:scale-110 transition-transform">
              <Upload className="h-6 w-6" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">Click to upload</p>
              <p className="text-[11px] text-muted-foreground mt-1">
                {description}
              </p>
              <p className="text-[11px] text-muted-foreground mt-1">
                Accepted: Images, PDF
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="p-3 bg-green-500 rounded-full text-white shadow-lg animate-in zoom-in-75">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              {file ? "New file selected" : "Existing file attached"}
            </p>

            <div className="absolute top-3 right-3">
              <Badge variant="secondary" className="gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Ready
              </Badge>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
