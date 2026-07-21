import { createFileRoute, Outlet } from "@tanstack/react-router";

// Auth check is handled inside AdminLayout (admin.tsx) by email comparison.
// We don't gate here so nested routes like /admin/puppies/$id render correctly
// regardless of whether the Supabase client can verify the session server-side.
export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  component: () => <Outlet />,
});
