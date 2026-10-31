/**
 * Wedding Invitation Data Models & Pure Logic Helpers
 */

export interface WeddingDetails {
  groomName: string;
  brideName: string;
  groomFamily: string;
  brideFamily: string;
  weddingDate: string; // ISO format or YYYY-MM-DDTHH:mm
  weddingDay: string;
  hennaDay: string;
  hennaLocation: string;
  hennaDescription: string;
  hallName: string;
  hallAddress: string;
  googleMapsUrl: string;
  wazeUrl: string;
  uberUrl: string;
  songTitle: string;
  songArtist: string;
  songUrl: string;
  songStartSeconds: number;
  googleSheetWebhookUrl: string;
  customMessage: string;
}

export interface TimelineItem {
  id: string;
  time: string;
  title: string;
  description: string;
  iconName: string;
}

export interface GuestComment {
  id: string;
  authorName: string;
  relation: string;
  message: string;
  reaction: string;
  createdAt: string;
  likes: number;
}

export interface GuestRsvp {
  id: string;
  guestName: string;
  attending: 'yes' | 'no';
  guestCount: number;
  dietaryOrNotes: string;
  submittedAt: string;
}

export interface CountdownState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

export const DEFAULT_WEDDING_DETAILS: WeddingDetails = {
  groomName: 'محمد صالح',
  brideName: 'زينب إمام',
  groomFamily: 'عائلة آل عتمان',
  brideFamily: 'عائلة آل سابق',
  weddingDate: '2026-11-05T19:00:00',
  weddingDay: 'يوم الخميس',
  hennaDay: 'يوم الأربعاء',
  hennaLocation: 'أمام منزل والد العريس',
  hennaDescription: 'ليلة الحنة والاحتفال الشعبي مع الأهل والأحباب والدي جي ورسم الحنة',
  hallName: 'قاعة جوليانا (Juliana Hall)',
  hallAddress: 'قاعة جوليانا للأفراح والمناسبات',
  googleMapsUrl: 'https://www.google.com/maps?q=30.3856805,31.2613040',
  wazeUrl: 'https://waze.com/ul?ll=30.3856805,31.2613040&navigate=yes',
  uberUrl: 'https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[latitude]=30.3856805&dropoff[longitude]=31.2613040&dropoff[formatted_address]=Juliana%20Hall',
  songTitle: 'الليلة دي',
  songArtist: 'عمرو دياب',
  songUrl: '/assets/audio/wedding-song.weba',
  songStartSeconds: 25,
  googleSheetWebhookUrl: 'https://script.google.com/macros/s/AKfycbwjfou_3Y2_cPvNcb-l3C2bbmf9AyRnLAhDwlQ-4wuqotDhJhvjL9KxQSt_cL8ynrIH/exec',
  customMessage: 'فرحتنا لا تكتمل إلا بوجودكم بيننا.. أهلاً ومرحباً بكم في ليلة العمر',
};

export const DEFAULT_TIMELINE: TimelineItem[] = [
  {
    id: '1',
    time: 'الأربعاء مساءً',
    title: 'ليلة الحنة الشعبية',
    description: 'أمام منزل والد العريس - أجواء الفرح والدي جي وتوزيع الحنة والاحتفال وسط الأهل والأحباب',
    iconName: 'Sparkles',
  },
  {
    id: '2',
    time: 'الخميس 07:00 م',
    title: 'استقبال ضيوف الزفاف بقاعة جوليانا',
    description: 'فتح أبواب قاعة جوليانا واستقبال الأهل والأصدقاء بضيافة وعصائر ترحيبية فاخرة',
    iconName: 'Sparkles',
  },
  {
    id: '3',
    time: 'الخميس 08:30 م',
    title: 'عقد القران المبارك',
    description: 'مراسم كتب الكتاب وإشهار الزواج ودعوات مباركة للعروسين بالبركة والتوفيق',
    iconName: 'BookOpen',
  },
  {
    id: '4',
    time: 'الخميس 09:30 م',
    title: 'زفة العروسين الملكية',
    description: 'دخول العريس محمد صالح والعروسة زينب إمام مع الطبول وأجواء الزفة المصرية البهية',
    iconName: 'Crown',
  },
  {
    id: '5',
    time: 'الخميس 10:30 م',
    title: 'البوفيه والعشاء المفتوح',
    description: 'وليمة العشاء الملكية مع أشهى المأكولات والمشروبات لكافة الضيوف الأعزاء',
    iconName: 'Utensils',
  },
  {
    id: '6',
    time: 'الخميس 11:30 م',
    title: 'تقطيع التورتة والرقصة الأولى',
    description: 'تقطيع كيك الزفاف ولحظات الرقصة الأولى والاحتفال الختامي الرائع',
    iconName: 'HeartHandshake',
  },
];

export const INITIAL_COMMENTS: GuestComment[] = [];

/**
 * Calculates countdown between now and target wedding date
 */
export function calculateCountdown(targetDateStr: string, currentDate: Date = new Date()): CountdownState {
  const target = new Date(targetDateStr).getTime();
  const now = currentDate.getTime();
  const diff = target - now;

  if (isNaN(target) || diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }

  const seconds = Math.floor((diff / 1000) % 60);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  return { days, hours, minutes, seconds, isPast: false };
}

/**
 * Formats wedding date nicely in Arabic
 */
export function formatWeddingDateArabic(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;

    const formatter = new Intl.DateTimeFormat('ar-EG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    return formatter.format(date);
  } catch {
    return dateStr;
  }
}

/**
 * Generates Google Calendar event link
 */
export function generateGoogleCalendarUrl(details: WeddingDetails): string {
  const startDate = new Date(details.weddingDate);
  if (isNaN(startDate.getTime())) return '#';
  const endDate = new Date(startDate.getTime() + 5 * 60 * 60 * 1000); // 5 hours duration

  const formatIso = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, '');
  const title = encodeURIComponent(`حفل زفاف ${details.groomName} & ${details.brideName}`);
  const detailsText = encodeURIComponent(`نتشرف بدعوتكم لحضور حفل زفافنا المبارك في ${details.hallName}`);
  const location = encodeURIComponent(`${details.hallName}, ${details.hallAddress}`);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${formatIso(startDate)}/${formatIso(endDate)}&details=${detailsText}&location=${location}`;
}

/**
 * Generates iCalendar (.ics) download data
 */
export function generateIcsContent(details: WeddingDetails): string {
  const startDate = new Date(details.weddingDate);
  const validStart = isNaN(startDate.getTime()) ? new Date() : startDate;
  const endDate = new Date(validStart.getTime() + 5 * 60 * 60 * 1000);

  const formatIso = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, '');

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Royal Wedding//AR',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `SUMMARY:حفل زفاف ${details.groomName} و ${details.brideName}`,
    `DESCRIPTION:نتشرف بحضوركم لمشاركتنا فرحة العمر في ${details.hallName}`,
    `LOCATION:${details.hallName} - ${details.hallAddress}`,
    `DTSTART:${formatIso(validStart)}`,
    `DTEND:${formatIso(endDate)}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

/**
 * Generates WhatsApp share URL with ready invite text
 */
export function generateWhatsAppShareUrl(details: WeddingDetails, shareUrl: string): string {
  const text = `💍 نتشرف بدعوتكم لحضور حفل زفاف:\n🤵 ${details.groomName} & 👰 ${details.brideName}\n\n📍 المكان: ${details.hallName}\n📅 الموعد: ${formatWeddingDateArabic(details.weddingDate)}\n\n✨ اضغط على الرابط لفتح بطاقة الدعوة الملكية ومعرفة كافة التفاصيل وتأكيد الحضور:\n${shareUrl}`;
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
}

/**
 * Exports comments to CSV / Excel compatible text
 */
export function exportCommentsToCsv(comments: GuestComment[], details: WeddingDetails): string {
  const header = '\uFEFFاسم المهنئ,صلة القرابة,نص التهنئة,التفاعل,وقت التهنئة,الإعجابات\n';
  const rows = comments.map(c => {
    const cleanMsg = `"${c.message.replace(/"/g, '""')}"`;
    const cleanAuthor = `"${c.authorName.replace(/"/g, '""')}"`;
    const cleanRelation = `"${c.relation.replace(/"/g, '""')}"`;
    return `${cleanAuthor},${cleanRelation},${cleanMsg},${c.reaction},${c.createdAt},${c.likes}`;
  });
  return header + rows.join('\n');
}

/**
 * Exports RSVPs to CSV
 */
export function exportRsvpsToCsv(rsvps: GuestRsvp[]): string {
  const header = '\uFEFFاسم الضيف,حالة الحضور,عدد المرافقين,ملاحظات,تاريخ التسجيل\n';
  const rows = rsvps.map(r => {
    const attendingLabel = r.attending === 'yes' ? 'سيحضر بكل سرور' : 'يعتذر عن الحضور';
    const cleanNotes = `"${(r.dietaryOrNotes || '-').replace(/"/g, '""')}"`;
    const cleanName = `"${r.guestName.replace(/"/g, '""')}"`;
    return `${cleanName},${attendingLabel},${r.guestCount},${cleanNotes},${r.submittedAt}`;
  });
  return header + rows.join('\n');
}

/**
 * Sends record to Google Sheets webhook if provided
 */
export async function sendToGoogleSheetWebhook(
  webhookUrl: string,
  payload: Record<string, any>
): Promise<{ success: boolean; message: string }> {
  if (!webhookUrl || !webhookUrl.startsWith('http')) {
    return { success: false, message: 'لم يتم إدخال رابط Google Sheet Webhook' };
  }

  try {
    // Mode no-cors with text/plain is standard and foolproof for Google Apps Script webhooks
    await fetch(webhookUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });
    return { success: true, message: 'تم الإرسال بنجاح إلى Google Sheets' };
  } catch (error: any) {
    return { success: false, message: error?.message || 'تعذر الإرسال لجوجل شيتس' };
  }
}
