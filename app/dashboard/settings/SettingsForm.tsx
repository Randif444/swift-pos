"use client";

import { useState } from "react";
import { updateTenantSettings } from "@/actions/tenant";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function SettingsForm({ tenant, user }: any) {
  const [liveName, setLiveName] = useState(tenant?.name || "");
  const [liveAddress, setLiveAddress] = useState(tenant?.address || "");
  const [livePhone, setLivePhone] = useState(tenant?.phone || "");

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 bg-slate-50 md:bg-white min-h-[100dvh] pb-28 md:pb-8">
      {/* Page Header */}
      <div className="space-y-1">
        <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-slate-900">
          Settings
        </h2>
        <p className="text-xs md:text-sm font-medium text-slate-500">
          Kelola konfigurasi dan pantau tampilan struk secara real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-start">
        <div className="col-span-1 md:col-span-12 lg:col-span-7 space-y-6 md:space-y-8">
          <form action={updateTenantSettings}>
            <input type="hidden" name="tenantId" value={tenant?.id || ""} />
            <input
              type="hidden"
              name="currentLogoUrl"
              value={tenant?.logo_url || ""}
            />

            <input type="hidden" name="name" value={liveName} />

            <Card className="shadow-sm border border-slate-100 bg-white rounded-[1.5rem] md:rounded-[2rem] overflow-hidden">
              <CardHeader className="p-5 md:p-8 pb-3 md:pb-4">
                <CardTitle className="text-base md:text-lg font-black text-slate-900 tracking-tight">
                  Branding Toko
                </CardTitle>
                <CardDescription className="text-[10px] md:text-xs font-medium text-slate-400">
                  Logo ini akan muncul di sidebar dan struk belanja pelanggan.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-5 md:p-8 pt-0">
                <div className="flex flex-col md:flex-row md:items-center gap-5 md:gap-8">
                  <div className="h-20 w-20 md:h-24 md:w-24 rounded-2xl md:rounded-[2rem] border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden bg-slate-50 shrink-0 shadow-inner mx-auto md:mx-0">
                    {tenant?.logo_url ? (
                      <img
                        src={tenant.logo_url}
                        alt="Logo Toko"
                        className="object-cover h-full w-full"
                      />
                    ) : (
                      <span className="text-[9px] md:text-[10px] text-slate-400 font-black uppercase text-center p-2 leading-tight">
                        No
                        <br />
                        Logo
                      </span>
                    )}
                  </div>

                  <div className="grid gap-3 flex-1 w-full">
                    <Label
                      htmlFor="logo"
                      className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center md:text-left"
                    >
                      Ganti Logo Toko
                    </Label>

                    <div className="flex flex-col gap-3 w-full">
                      <Input
                        id="logo"
                        name="logo"
                        type="file"
                        accept="image/*"
                        className="w-full h-12 rounded-xl md:rounded-2xl border-slate-200 font-bold text-xs cursor-pointer shadow-sm file:text-slate-500"
                      />

                      <Button
                        type="submit"
                        size="sm"
                        className="w-full md:w-fit bg-slate-900 hover:bg-black text-white h-12 md:h-9 md:px-6 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-md active:scale-95 transition-all"
                      >
                        Update Logo
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </form>

          <form action={updateTenantSettings}>
            <input type="hidden" name="tenantId" value={tenant?.id || ""} />

            <input
              type="hidden"
              name="currentLogoUrl"
              value={tenant?.logo_url || ""}
            />

            <Card className="shadow-sm border border-slate-100 bg-white rounded-[1.5rem] md:rounded-[2rem] overflow-hidden">
              <CardHeader className="p-5 md:p-8 pb-3 md:pb-4">
                <CardTitle className="text-base md:text-lg font-black text-slate-900 tracking-tight">
                  Informasi Toko
                </CardTitle>
              </CardHeader>

              <CardContent className="p-5 md:p-8 pt-0 space-y-5 md:space-y-6">
                <div className="grid gap-2 md:gap-3">
                  <Label
                    htmlFor="name"
                    className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400"
                  >
                    Nama Toko
                  </Label>

                  <Input
                    id="name"
                    name="name"
                    value={liveName}
                    onChange={(e) => setLiveName(e.target.value)}
                    placeholder="Contoh: Warung Madura"
                    className="w-full rounded-xl md:rounded-2xl h-12 md:h-14 border-slate-200 font-black text-slate-900 focus:ring-4 focus:ring-slate-100 transition-all shadow-sm text-sm"
                  />
                </div>

                <div className="grid gap-2 md:gap-3">
                  <Label
                    htmlFor="address"
                    className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400"
                  >
                    Alamat Lengkap
                  </Label>

                  <Input
                    id="address"
                    name="address"
                    value={liveAddress}
                    onChange={(e) => setLiveAddress(e.target.value)}
                    placeholder="Alamat yang akan muncul di struk"
                    className="w-full rounded-xl md:rounded-2xl h-12 md:h-14 border-slate-200 font-black text-slate-900 focus:ring-4 focus:ring-slate-100 transition-all shadow-sm text-sm"
                  />
                </div>

                <div className="grid gap-2 md:gap-3">
                  <Label
                    htmlFor="phone"
                    className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400"
                  >
                    Nomor Telepon
                  </Label>

                  <Input
                    id="phone"
                    name="phone"
                    value={livePhone}
                    onChange={(e) => setLivePhone(e.target.value)}
                    placeholder="0812xxxx"
                    className="w-full rounded-xl md:rounded-2xl h-12 md:h-14 border-slate-200 font-black text-slate-900 focus:ring-4 focus:ring-slate-100 transition-all shadow-sm text-sm"
                  />
                </div>

                <div className="pt-2 md:pt-4">
                  <Button
                    type="submit"
                    className="w-full md:w-auto bg-slate-900 hover:bg-black text-white md:px-10 h-14 rounded-xl md:rounded-2xl font-black text-xs md:text-sm shadow-xl shadow-slate-200 transition-all active:scale-95 uppercase tracking-widest md:normal-case md:tracking-normal"
                  >
                    Simpan Informasi
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>

          <Card className="shadow-sm border border-slate-100 bg-white opacity-60 rounded-[1.5rem] md:rounded-[2rem]">
            <CardHeader className="p-5 md:p-8 py-4 md:py-6">
              <CardTitle className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Akun Pemilik
              </CardTitle>

              <p className="text-xs md:text-sm font-bold text-slate-900 mt-1 md:mt-2 truncate">
                {user.email}
              </p>
            </CardHeader>
          </Card>
        </div>

        <div className="col-span-1 md:col-span-12 lg:col-span-5 sticky top-4 md:top-8">
          <div className="space-y-3 md:space-y-4">
            <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-2 md:px-4">
              Simulasi Tampilan Thermal Printer
            </p>

            <div className="bg-[#fdfdfd] border border-slate-200 rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-10 shadow-xl md:shadow-2xl shadow-slate-100 relative overflow-hidden ring-1 ring-slate-100">
              <div className="space-y-5 md:space-y-6 font-mono text-center">
                <div className="flex justify-center">
                  {tenant?.logo_url ? (
                    <img
                      src={tenant.logo_url}
                      className="h-12 md:h-14 w-auto grayscale opacity-90 object-contain"
                      alt="Logo Preview"
                    />
                  ) : (
                    <div className="h-10 w-10 md:h-12 md:w-12 border-2 border-dashed border-slate-200 rounded-full flex items-center justify-center text-[7px] md:text-[8px] text-slate-300 font-black uppercase">
                      LOGO
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm md:text-base font-black uppercase tracking-tight text-slate-900">
                    {liveName || "SWIFT POS SYSTEM"}
                  </h3>

                  <p className="text-[9px] md:text-[10px] text-slate-500 leading-tight uppercase font-medium">
                    {liveAddress || "Jl. Contoh Alamat No. 01, Kota Akang"}
                  </p>

                  <p className="text-[9px] md:text-[10px] text-slate-500 font-medium">
                    Telp: {livePhone || "08xx-xxxx-xxxx"}
                  </p>
                </div>

                <div className="border-b border-dashed border-slate-300 my-3 md:my-4"></div>

                <div className="space-y-2 md:space-y-3 text-[9px] md:text-[10px] text-left font-medium">
                  <div className="flex justify-between items-start">
                    <span className="flex-1 pr-2">Kopi ABC Susu x2</span>
                    <span className="shrink-0">Rp3.000</span>
                  </div>

                  <div className="flex justify-between items-start">
                    <span className="flex-1 pr-2">Minyak Goreng 1L x1</span>
                    <span className="shrink-0">Rp14.000</span>
                  </div>

                  <div className="flex justify-between items-start">
                    <span className="flex-1 pr-2">Coca Cola 330ml x1</span>
                    <span className="shrink-0">Rp5.000</span>
                  </div>
                </div>

                <div className="border-b border-dashed border-slate-300 my-3 md:my-4"></div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs md:text-sm font-black text-slate-900">
                    <span>TOTAL</span>
                    <span>Rp22.000</span>
                  </div>

                  <div className="flex justify-between text-[9px] md:text-[10px] text-slate-400 font-bold uppercase">
                    <span>Tunai</span>
                    <span>Rp50.000</span>
                  </div>

                  <div className="flex justify-between text-[9px] md:text-[10px] text-slate-900 font-black uppercase tracking-tight">
                    <span>Kembali</span>
                    <span>Rp28.000</span>
                  </div>
                </div>

                <div className="pt-6 md:pt-8 space-y-1.5 md:space-y-2 text-[8px] md:text-[9px] text-slate-400 font-bold">
                  <p className="tracking-[0.3em] uppercase">
                    *** TERIMA KASIH ***
                  </p>
                  <p className="italic">
                    Barang yang sudah dibeli tidak dapat ditukar
                  </p>
                  <p className="text-[6px] md:text-[7px] mt-2 opacity-50 tracking-widest uppercase">
                    Power by Swift POS
                  </p>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[radial-gradient(circle,_#e2e8f0_1px,_transparent_1px)] bg-[length:8px_8px] opacity-30"></div>
            </div>

            <div className="p-3 md:p-4 bg-emerald-50 rounded-xl md:rounded-2xl border border-emerald-100 flex gap-2 md:gap-3 items-center">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></div>
              <p className="text-[9px] md:text-[10px] font-black text-emerald-700 uppercase tracking-wider">
                Live Preview Aktif
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
