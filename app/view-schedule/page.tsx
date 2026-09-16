// app/view-schedule/page.tsx
import { ViewSchedule } from "@/components/view-schedule";

export const metadata = {
  title: "View Schedule | Conkub",
  description: "ดูตารางงานคอนเสิร์ตทั้งหมดบน Conkub",
};

export default function ViewSchedulePage() {
  return (
    <main>
      {/* เรียกใช้งาน Component ViewSchedule ที่เราสร้างไว้ */}
      <ViewSchedule /> 
    </main>
  );
}