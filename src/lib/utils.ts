import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export const FACILITIES = [
  "Wi-Fi",
  "AC",
  "Kamar Mandi Dalam",
  "Kamar Mandi Luar",
  "Kasur",
  "Lemari",
  "Meja Belajar",
  "Kursi",
  "TV",
  "Kulkas",
  "Dapur Bersama",
  "Laundry",
  "Parkir Motor",
  "Parkir Mobil",
  "Keamanan 24 Jam",
  "CCTV",
  "Lift",
  "Kolam Renang",
  "Gym",
  "Rooftop",
];

export const INDONESIAN_CITIES = [
  "Jakarta",
  "Bandung",
  "Surabaya",
  "Yogyakarta",
  "Semarang",
  "Medan",
  "Makassar",
  "Palembang",
  "Bali",
  "Malang",
  "Bogor",
  "Depok",
  "Tangerang",
  "Bekasi",
];

export const KOST_TYPES = [
  { value: "PUTRA", label: "Kost Putra" },
  { value: "PUTRI", label: "Kost Putri" },
  { value: "CAMPUR", label: "Kost Campur" },
];

export const BOOKING_STATUS_MAP: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Menunggu", color: "yellow" },
  CONFIRMED: { label: "Dikonfirmasi", color: "green" },
  REJECTED: { label: "Ditolak", color: "red" },
  CANCELLED: { label: "Dibatalkan", color: "gray" },
  COMPLETED: { label: "Selesai", color: "blue" },
};
