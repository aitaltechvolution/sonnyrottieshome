import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { KeyRound, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  head: () => ({ meta: [{ title: "Settings — Admin" }] }),
  component: AdminSettings,
});

const schema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

type FormValues = z.infer<typeof schema>;

function AdminSettings() {
  const [showPw, setShowPw] = useState(false);
  const [showCf, setShowCf] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormValues) => {
    const { error } = await supabase.auth.updateUser({ password: data.password });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Password updated successfully.");
    reset();
  };

  return (
    <div className="max-w-md">
      <p className="mb-2 text-xs uppercase tracking-[0.3em] text-gold">Admin Settings</p>
      <h1 className="font-display text-3xl">Change Password</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Update the password for your admin account. Must be at least 8 characters.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 rounded-3xl border border-border/60 bg-surface/60 p-6 space-y-5"
      >
        {/* New password */}
        <label className="block">
          <span className="mb-2 block text-[11px] uppercase tracking-widest text-muted-foreground">
            New Password
          </span>
          <div className="relative">
            <input
              {...register("password")}
              type={showPw ? "text" : "password"}
              className="h-11 w-full rounded-xl border border-border/60 bg-background/60 px-4 pr-11 text-sm outline-none focus:border-gold"
              placeholder="Min. 8 characters"
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <span className="mt-1 block text-xs text-destructive">{errors.password.message}</span>
          )}
        </label>

        {/* Confirm password */}
        <label className="block">
          <span className="mb-2 block text-[11px] uppercase tracking-widest text-muted-foreground">
            Confirm New Password
          </span>
          <div className="relative">
            <input
              {...register("confirm")}
              type={showCf ? "text" : "password"}
              className="h-11 w-full rounded-xl border border-border/60 bg-background/60 px-4 pr-11 text-sm outline-none focus:border-gold"
              placeholder="Repeat new password"
            />
            <button
              type="button"
              onClick={() => setShowCf((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showCf ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirm && (
            <span className="mt-1 block text-xs text-destructive">{errors.confirm.message}</span>
          )}
        </label>

        <button
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-medium text-primary-foreground shadow-luxe hover:brightness-110 disabled:opacity-60"
        >
          <KeyRound className="h-4 w-4" />
          {isSubmitting ? "Updating…" : "Update Password"}
        </button>
      </form>
    </div>
  );
}
