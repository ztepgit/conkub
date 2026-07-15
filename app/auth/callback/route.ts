// app/auth/callback/route.ts
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // หากมีการแนบ ?next=/profile มา จะให้เด้งไปหน้านั้นหลังล็อกอินสำเร็จ ถ้าไม่มีจะกลับไปหน้าแรก
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const cookieStore = await cookies();
    
    // สร้าง Supabase Client สำหรับฝั่ง Server เพื่อจัดการ Cookies
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // ดัก Error ไว้ในกรณีที่ถูกเรียกจาก Server Component ที่ไม่สามารถ set cookie ได้
            }
          },
        },
      }
    );

    // นำ code ที่ได้จาก Google ไปแลกเป็น Session (JWT) จาก Supabase
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // สำหรับ Production บน Vercel มักจะต้องเช็ค x-forwarded-host เพื่อให้ Redirect ถูก Domain เสมอ
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    } else {
      console.error("Auth callback error:", error.message);
    }
  }

  // หากเกิดข้อผิดพลาด หรือไม่มี code ให้กลับไปหน้าแรกพร้อมแจ้ง Error
  return NextResponse.redirect(`${origin}/?error=auth-callback-failed`);
}