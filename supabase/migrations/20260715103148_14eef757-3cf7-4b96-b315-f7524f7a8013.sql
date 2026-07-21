
-- Roles
CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;

CREATE POLICY "user can read own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- updated_at helper
CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS TRIGGER
LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- Puppies
CREATE TABLE public.puppies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  gender text NOT NULL CHECK (gender IN ('Male','Female')),
  age_weeks int NOT NULL DEFAULT 8,
  dob date,
  color text,
  weight text,
  price numeric,
  status text NOT NULL DEFAULT 'Available' CHECK (status IN ('Available','Reserved','Sold')),
  featured boolean NOT NULL DEFAULT false,
  image_url text,
  gallery text[] NOT NULL DEFAULT '{}',
  description text,
  temperament text,
  vaccination text,
  deworming text,
  father text,
  mother text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.puppies TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.puppies TO authenticated;
GRANT ALL ON public.puppies TO service_role;
ALTER TABLE public.puppies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "puppies public read" ON public.puppies FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admin insert puppies" ON public.puppies FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin update puppies" ON public.puppies FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin delete puppies" ON public.puppies FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(),'admin'));

CREATE TRIGGER puppies_updated_at BEFORE UPDATE ON public.puppies
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Enquiries
CREATE TABLE public.enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  puppy_name text,
  puppy_id uuid REFERENCES public.puppies(id) ON DELETE SET NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new','contacted','closed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.enquiries TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.enquiries TO authenticated;
GRANT ALL ON public.enquiries TO service_role;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can submit enquiry" ON public.enquiries FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admin read enquiries" ON public.enquiries FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin update enquiries" ON public.enquiries FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin delete enquiries" ON public.enquiries FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(),'admin'));

CREATE TRIGGER enquiries_updated_at BEFORE UPDATE ON public.enquiries
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Storage policies for the 'puppies' bucket (bucket created via tool)
