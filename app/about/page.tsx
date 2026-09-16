// app/about/page.tsx
import { AboutUs } from "@/components/about-us";

export const metadata = {
  title: "About Us | Conkub",
  description: "รู้จักกับ Conkub แพลตฟอร์มจองตั๋วคอนเสิร์ตชั้นนำ",
};

export default function AboutPage() {
  return (
    <main>
      {/* เรียกใช้งาน Component AboutUs ที่เราสร้างไว้ */}
      <AboutUs /> 
    </main>
  );
}