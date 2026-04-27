import { BookOpen, FileCog, UserCheck, LucideIcon } from 'lucide-react';

export type Language = 'en' | 'th';

type Translatable = {
  [key in Language]: string;
};

export interface Service {
  id: number;
  slug: string;
  title: Translatable;
  shortDescription: Translatable;
  longDescription: Translatable;
  icon: LucideIcon;
  image: string;
}

export interface TeamMember {
  id: number;
  name: string;
  position: Translatable;
  bio: Translatable;
  image: string;
}

export interface Insight {
  id: number;
  slug: string;
  title: Translatable;
  author: string;
  date: string;
  excerpt: Translatable;
  content: Translatable;
  image: string;
}

export const services: Service[] = [
  {
    id: 1,
    slug: 'accounting-services',
    title: {
      en: 'Accounting Services',
      th: 'บริการด้านบัญชี',
    },
    shortDescription: {
      en: 'We provide comprehensive accounting services in accordance with generally accepted accounting standards.',
      th: 'เราให้บริการด้านบัญชีที่ครอบคลุมตามมาตรฐานการบัญชีที่รับรองทั่วไป',
    },
    longDescription: {
        en: 'We provide comprehensive accounting services in accordance with generally accepted accounting standards. Our services include bookkeeping, financial statement preparation, and tax filing to ensure your business is compliant and financially sound.',
        th: 'เราให้บริการด้านบัญชีที่ครอบคลุมตามมาตรฐานการบัญชีที่รับรองทั่วไป บริการของเราประกอบด้วยการทำบัญชี การจัดทำงบการเงิน และการยื่นภาษี เพื่อให้แน่ใจว่าธุรกิจของคุณปฏิบัติตามกฎระเบียบและมีความมั่นคงทางการเงิน',
    },
    icon: BookOpen,
    image: 'service-accounting',
  },
  {
    id: 2,
    slug: 'accounting-system-setup',
    title: {
      en: 'Set up an accounting system',
      th: 'จัดตั้งระบบบัญชี',
    },
    shortDescription: {
      en: 'Designing an accounting structure for effective management.',
      th: 'ออกแบบโครงสร้างทางบัญชีเพื่อการจัดการที่มีประสิทธิภาพ',
    },
    longDescription: {
        en: 'We design and implement customized accounting systems tailored to your business needs. A well-structured accounting system provides valuable insights for decision-making, improves efficiency, and supports your company\'s growth. Our process involves analyzing your workflow, selecting the right software, and training your team.',
        th: 'เราออกแบบและนำไปใช้ซึ่งระบบบัญชีที่ปรับแต่งให้เหมาะกับความต้องการทางธุรกิจของคุณ ระบบบัญชีที่มีโครงสร้างดีจะให้ข้อมูลเชิงลึกที่มีค่าสำหรับการตัดสินใจ, เพิ่มประสิทธิภาพ และสนับสนุนการเติบโตของบริษัทของคุณ กระบวนการของเราประกอบด้วยการวิเคราะห์ขั้นตอนการทำงาน, การเลือกซอฟต์แวร์ที่เหมาะสม และการฝึกอบรมทีมของคุณ',
    },
    icon: FileCog,
    image: 'service-accounting-system',
  },
  {
    id: 3,
    slug: 'legal-advisor',
    title: {
      en: 'Legal Advisor',
      th: 'ที่ปรึกษากฎหมาย',
    },
    shortDescription: {
      en: 'Providing legal advice for business, visas, and work permits.',
      th: 'ให้คำปรึกษาด้านกฎหมายสำหรับธุรกิจ วีซ่า และใบอนุญาตทำงาน',
    },
    longDescription: {
        en: 'Our legal advisors offer expert guidance on a wide range of legal matters. We specialize in business law, including contracts and compliance, as well as immigration law, assisting clients with visa applications and work permits. We are committed to providing clear and practical legal solutions.',
        th: 'ที่ปรึกษากฎหมายของเราให้คำแนะนำจากผู้เชี่ยวชาญในเรื่องกฎหมายที่หลากหลาย เราเชี่ยวชาญด้านกฎหมายธุรกิจ รวมถึงสัญญาและการปฏิบัติตามกฎระเบียบ ตลอดจนกฎหมายคนเข้าเมือง โดยให้ความช่วยเหลือลูกค้าในการยื่นขอวีซ่าและใบอนุญาตทำงาน เรามุ่งมั่นที่จะมอบโซลูชันทางกฎหมายที่ชัดเจนและนำไปปฏิบัติได้จริง',
    },
    icon: UserCheck,
    image: 'service-legal-advisor',
  },
];

export const team: TeamMember[] = [];

export const insights: Insight[] = [];


export const translations = {
    // Navigation
    home: { en: 'Home', th: 'หน้าแรก' },
    services: { en: 'Banking Services for SMEs', th: 'บริการธนาคารสำหรับ SME' },
    about_us: { en: 'About Us', th: 'เกี่ยวกับเรา' },
    our_team: { en: 'Our Team', th: 'ทีมงานของเรา' },
    insights: { en: 'Insights', th: 'บทความ' },
    contact_us: { en: 'Contact Us', th: 'ติดต่อเรา' },
    // Homepage Hero
    home_hero_title: { en: 'Your Partner for Sustainable Success', th: 'พันธมิตรของคุณเพื่อความสำเร็จที่ยั่งยืน' },
    home_hero_subtitle: { en: 'Bank of Ayudhya provides professional banking services for SMEs.', th: 'Bank of Ayudhya ให้บริการด้านการธนาคารสำหรับ SME อย่างมืออาชีพ' },
    home_hero_cta: { en: 'Get a Consultation', th: 'ขอคำปรึกษา' },
    // Homepage Services
    home_services_title: { en: 'Our Banking Services for SMEs', th: 'บริการธนาคารสำหรับ SME ของเรา' },
    home_services_subtitle: { en: 'We are committed to providing banking services tailored for the sustainable success of SMEs.', th: 'เรามุ่งมั่นที่จะให้บริการธนาคารที่เหมาะกับความสำเร็จที่ยั่งยืนของ SME' },
    learn_more: { en: 'Learn More', th: 'เรียนรู้เพิ่มเติม' },
    view_all_services: { en: 'View All Banking Services', th: 'ดูบริการธนาคารทั้งหมด' },
    // Homepage About CTA
    home_about_title: { en: 'Leading Business Consulting Firm', th: 'บริษัทที่ปรึกษากฎหมายชั้นนำ' },
    home_about_subtitle: { en: 'We are a leading business consulting firm specializing in accounting, law, and taxation.', th: 'เราเป็นบริษัทที่ปรึกษากฎหมายชั้นนำที่เชี่ยวชาญด้านบัญชี กฎหมาย และภาษีอากร' },
    home_about_point1_title: { en: 'Expert Team', th: 'ทีมผู้เชี่ยวชาญ' },
    home_about_point1_desc: { en: 'Our team consists of experienced professionals dedicated to your success.', th: 'ทีมงานของเราประกอบด้วยผู้เชี่ยวชาญที่มีประสบการณ์ซึ่งอุทิศตนเพื่อความสำเร็จของคุณ' },
    home_about_point2_title: { en: 'Comprehensive Solutions', th: 'โซลูชั่นที่ครอบคลุม' },
    home_about_point2_desc: { en: 'We provide integrated services covering accounting, legal, and tax matters.', th: 'เราให้บริการแบบครบวงจรซึ่งครอบคลุมเรื่องบัญชี กฎหมาย และภาษี' },
    learn_more_about_us: { en: 'Learn More About Us', th: 'เรียนรู้เพิ่มเติมเกี่ยวกับเรา' },
    // Footer
    footer_tagline: { en: 'Your trusted partner for business in Thailand.', th: 'พันธมิตรที่เชื่อถือได้ของคุณสำหรับธุรกิจในประเทศไทย' },
    quick_links: { en: 'Quick Links', th: 'ลิงก์ด่วน' },
    // General
    search: { en: 'Search', th: 'ค้นหา' },
    // About Page
    about_page_title: { en: 'About Bank of Ayudhya', th: 'เกี่ยวกับ Bank of Ayudhya' },
    about_page_subtitle: { en: 'Committed to providing professional services for the sustainable success of your business.', th: 'มุ่งมั่นที่จะให้บริการอย่างมืออาชีพเพื่อความสำเร็จที่ยั่งยืนของธุรกิจของคุณ' },
    our_mission: { en: 'Our Mission', th: 'ภารกิจของเรา' },
    our_mission_text: { en: 'To empower our clients with the knowledge and support necessary to achieve their business objectives in a complex regulatory environment.', th: 'เพื่อเสริมศักยภาพให้ลูกค้าของเราด้วยความรู้และการสนับสนุนที่จำเป็นต่อการบรรลุวัตถุประสงค์ทางธุรกิจในสภาพแวดล้อมด้านกฎระเบียบที่ซับซ้อน' },
    our_vision: { en: 'Our Vision', th: 'วิสัยทัศน์ของเรา' },
    our_vision_text: { en: 'To be the leading and most trusted multidisciplinary professional service firm in Thailand, renowned for our expertise and client-centric approach.', th: 'เพื่อเป็นบริษัทที่ปรึกษาหลายสาขาวิชาชีพชั้นนำและน่าเชื่อถือที่สุดในประเทศไทย ซึ่งมีชื่อเสียงในด้านความเชี่ยวชาญและแนวทางที่ยึดลูกค้าเป็นศูนย์กลาง' },
    // Team Page
    team_page_title: { en: 'Our Experts', th: 'ผู้เชี่ยวชาญของเรา' },
    team_page_subtitle: { en: 'Meet the dedicated professionals behind our success. Our team combines local expertise with international standards.', th: 'พบกับมืออาชีพที่ทุ่มเทซึ่งอยู่เบื้องหลังความสำเร็จของเรา ทีมงานของเรารวมความเชี่ยวชาญในท้องถิ่นเข้ากับมาตรฐานสากล' },
    // Services Page
    services_page_title: { en: 'Banking Services for SMEs', th: 'บริการธนาคารสำหรับ SME' },
    services_page_subtitle: { en: 'Explore our banking services designed exclusively for SMEs to support your business growth.', th: 'สำรวจบริการธนาคารของเราที่ออกแบบมาเพื่อ SME โดยเฉพาะเพื่อสนับสนุนการเติบโตของธุรกิจคุณ' },
    // Insights Page
    insights_page_title: { en: 'News & Insights', th: 'ข่าวสารและบทความ' },
    insights_page_subtitle: { en: 'Stay informed with our latest articles, analysis, and legal updates from our team of experts.', th: 'ติดตามข่าวสารล่าสุด บทวิเคราะห์ และการอัปเดตทางกฎหมายจากทีมผู้เชี่ยวชาญของเรา' },
    read_more: { en: 'Read More', th: 'อ่านต่อ' },
    // Contact Page
    contact_page_title: { en: 'Get in Touch', th: 'ติดต่อเรา' },
    contact_page_subtitle: { en: 'We\'re here to help. Reach out to us for a consultation or to learn more about our services.', th: 'เราพร้อมให้ความช่วยเหลือ ติดต่อเราเพื่อขอคำปรึกษาหรือเรียนรู้เพิ่มเติมเกี่ยวกับบริการของเรา' },
    contact_form_name: { en: 'Full Name', th: 'ชื่อ-นามสกุล' },
    contact_form_email: { en: 'Email Address', th: 'ที่อยู่อีเมล' },
    contact_form_subject: { en: 'Subject', th: 'หัวข้อ' },
    contact_form_message: { en: 'Your Message', th: 'ข้อความของคุณ' },
    contact_form_submit: { en: 'Send Message', th: 'ส่งข้อความ' },
    contact_info: { en: 'Contact Information', th: 'ข้อมูลการติดต่อ' },
    address: { en: 'Address', th: 'ที่อยู่' },
    address_details: { en: '760/305 Soi Phatthanakan 38, Suan Luang Subdistrict, Suan Luang District, Bangkok 10250', th: '760/305 ซอยพัฒนาการ 38 แขวงสวนหลวง เขตสวนหลวง กรุงเทพมหานคร 10250' },
    phone: { en: 'Phone', th: 'โทรศัพท์' },
    email: { en: 'Email', th: 'อีเมล' },
    contact_success_title: { en: 'Message Sent!', th: 'ส่งข้อความสำเร็จ!' },
    contact_success_desc: { en: 'Thank you for contacting us. We will get back to you shortly.', th: 'ขอบคุณที่ติดต่อเรา เราจะติดต่อกลับไปหาคุณในไม่ช้า' },
    contact_error_title: { en: 'An Error Occurred', th: 'เกิดข้อผิดพลาด' },
    contact_error_desc: { en: 'There was a problem sending your message. Please try again later.', th: 'เกิดปัญหาในการส่งข้อความของคุณ กรุณาลองใหม่อีกครั้งในภายหลัง' },
    other_services: { en: 'Other Banking Services', th: 'บริการธนาคารอื่นๆ' },
  // Workflow Management Feature
  workflowManagementTitle: { en: 'Workflow Management', th: 'การจัดการเวิร์กโฟลว์' },
  workflowManagementSubtitle: { en: 'Monitor and manage all active lending jobs across your branch.', th: 'ตรวจสอบและจัดการงานสินเชื่อที่ใช้งานอยู่ทั้งหมดในสาขาของคุณ' },
  workflowManagementTabsMyJobs: { en: 'My Jobs', th: 'งานของฉัน' },
  workflowManagementTabsTrackedJobs: { en: 'Tracked Jobs', th: 'งานที่ติดตาม' },
  workflowManagementTabsTeamsJobs: { en: "Team's Jobs", th: 'งานของทีม' },
  workflowManagementTabsUnassignedJobs: { en: 'Unassigned Jobs', th: 'งานที่ยังไม่มีผู้รับผิดชอบ' },
  workflowManagementNavCreateNewJob: { en: 'Create New Job', th: 'สร้างงานใหม่' },
  workflowManagementWidgetLoanEngineTitle: { en: 'Loan Approval Engine', th: 'ระบบอนุมัติสินเชื่ออัตโนมัติ' },
  workflowManagementWidgetLoanEngineSubtitle: { en: 'Automated scoring system processing queue.', th: 'ระบบให้คะแนนอัตโนมัติกำลังประมวลผลคิว' },
  workflowManagementWidgetLoanEngineBadge: { en: 'Live Engine', th: 'เครื่องมือสด' },
  workflowManagementWidgetLoanEngineAccuracy: { en: 'Accuracy Rate', th: 'อัตราความแม่นยำ' },
  workflowManagementWidgetLoanEngineConfigure: { en: 'Configure', th: 'ตั้งค่า' },
  workflowManagementWidgetLoanEngineOffline: { en: 'Offline', th: 'ออฟไลน์' },
  workflowManagementWidgetCreditInsightsTitle: { en: 'Credit Insights', th: 'ข้อมูลเชิงลึกด้านเครดิต' },
  workflowManagementWidgetCreditInsightsSubtitle: { en: 'Portfolio health analysis and risk trends.', th: 'การวิเคราะห์สุขภาพพอร์ตโฟลิโอและแนวโน้มความเสี่ยง' },
  workflowManagementWidgetCreditInsightsAlert: { en: 'High Risk Alert', th: 'การแจ้งเตือนความเสี่ยงสูง' },
  workflowManagementStatsTitle: { en: 'Quick Stats', th: 'สถิติด่วน' },
  workflowManagementStatsProcessingCapacity: { en: 'Processing Capacity', th: 'ความจุในการประมวลผล' },
  workflowManagementStatsWeekly: { en: 'Weekly', th: 'รายสัปดาห์' },
  workflowManagementStatsMom: { en: 'M-O-M', th: 'MoM' },
  workflowManagementDeadlinesTitle: { en: 'Upcoming Deadlines', th: 'กำหนดส่งที่ใกล้ถึง' },
  workflowManagementDeadlinesViewCalendar: { en: 'View Calendar', th: 'ดูปฏิทิน' },
  workflowManagementStatusNew: { en: 'New', th: 'ใหม่' },
  workflowManagementStatusPendingStart: { en: 'Pending Start', th: 'รอเริ่มงาน' },
  workflowManagementStatusInProgress: { en: 'In Progress', th: 'กำลังดำเนินการ' },
  workflowManagementStatusCompleted: { en: 'Completed', th: 'เสร็จสิ้น' },
  workflowManagementStatusOverdue: { en: 'Overdue', th: 'เลยกำหนด' },
  workflowManagementStatusCancelled: { en: 'Cancelled', th: 'ยกเลิก' },
  workflowManagementTableJobNo: { en: 'Job No.', th: 'หมายเลขงาน' },
  workflowManagementTableStatus: { en: 'Status', th: 'สถานะ' },
  workflowManagementTableApplicantInfo: { en: 'Applicant Info', th: 'ข้อมูลผู้สมัคร' },
  workflowManagementTableCaNo: { en: 'CA No.', th: 'เลขที่ CA' },
  workflowManagementTableSegment: { en: 'Segment', th: 'กลุ่ม' },
  workflowManagementTableJobOwner: { en: 'Job Owner', th: 'เจ้าของงาน' },
  workflowManagementTableTotal: { en: 'Total', th: 'ทั้งหมด' },
  workflowManagementTableItems: { en: 'items', th: 'รายการ' },
  workflowManagementCreateJobTitle: { en: 'Create New Job', th: 'สร้างงานใหม่' },
  workflowManagementCreateJobSubtitle: { en: 'Fill in the details below to create a new lending job.', th: 'กรอกรายละเอียดด้านล่างเพื่อสร้างงานสินเชื่อใหม่' },
  workflowManagementCreateJobApplicantName: { en: 'Applicant Name', th: 'ชื่อผู้สมัคร' },
  workflowManagementCreateJobApplicantNamePlaceholder: { en: 'e.g. Modern Retail Corp.', th: 'เช่น Modern Retail Corp.' },
  workflowManagementCreateJobCifNo: { en: 'CIF No.', th: 'เลขที่ CIF' },
  workflowManagementCreateJobCifNoPlaceholder: { en: '10-digit CIF number', th: 'หมายเลข CIF 10 หลัก' },
  workflowManagementCreateJobCaNo: { en: 'CA No.', th: 'เลขที่ CA' },
  workflowManagementCreateJobCaNoPlaceholder: { en: 'e.g. CA-7721-OP', th: 'เช่น CA-7721-OP' },
  workflowManagementCreateJobSegment: { en: 'Segment', th: 'กลุ่ม' },
  workflowManagementCreateJobSegmentPlaceholder: { en: 'Select segment', th: 'เลือกกลุ่ม' },
  workflowManagementCreateJobRefNo: { en: 'Reference No.', th: 'เลขที่อ้างอิง' },
  workflowManagementCreateJobRefNoPlaceholder: { en: 'e.g. L-9921-X (optional)', th: 'เช่น L-9921-X (ไม่บังคับ)' },
  workflowManagementCreateJobSubmit: { en: 'Create Job', th: 'สร้างงาน' },
  workflowManagementCreateJobCancel: { en: 'Cancel', th: 'ยกเลิก' },
  workflowManagementActionView: { en: 'View Details', th: 'ดูรายละเอียด' },
  workflowManagementActionAssign: { en: 'Assign Owner', th: 'มอบหมายเจ้าของ' },
  workflowManagementActionMarkComplete: { en: 'Mark as Complete', th: 'ทำเครื่องหมายว่าเสร็จสิ้น' },
  workflowManagementActionCancel: { en: 'Cancel Job', th: 'ยกเลิกงาน' },
  workflowManagementEngineConfigureTitle: { en: 'Configure Engine', th: 'ตั้งค่าเครื่องมือ' },
  // Workflow Management Layout - Top Nav
  topNavLendingHub: { en: 'Lending Hub', th: 'Lending Hub' },
  // Workflow Management Layout - Sidebar
  sidebarWorkflowManagement: { en: 'Workflow Management', th: 'การจัดการเวิร์กโฟลว์' },
  sidebarAllJobs: { en: 'All Jobs', th: 'งานทั้งหมด' },
  sidebarContractManagement: { en: 'Contract Management', th: 'การจัดการสัญญา' },
  sidebarContractTemplate: { en: 'Contract Template', th: 'แม่แบบสัญญา' },
  sidebarSystemManagement: { en: 'System Management', th: 'การจัดการระบบ' },
  sidebarUserManagement: { en: 'User Management', th: 'การจัดการผู้ใช้' },
  sidebarActivityLog: { en: 'Activity Log', th: 'บันทึกกิจกรรม' },
  sidebarItems: { en: 'Items', th: 'รายการ' },
  // Job Info Feature
  jobInfoNavBackToWorkflow: { en: 'Back to Workflow Management', th: 'กลับไปยังการจัดการงาน' },
  jobInfoHeaderJobDetails: { en: 'Job Details', th: 'รายละเอียดงาน' },
  jobInfoHeaderViewChanges: { en: 'View Changes', th: 'ดูการเปลี่ยนแปลง' },
  jobInfoHeaderSaveChanges: { en: 'Save Changes', th: 'บันทึกการเปลี่ยนแปลง' },
  jobInfoSectionGeneralInformation: { en: 'General Information', th: 'ข้อมูลทั่วไป' },
  jobInfoSectionOverallInformation: { en: 'Overall Information', th: 'ข้อมูลโดยรวม' },
  jobInfoSectionCfaInformation: { en: 'Credit Facility Agreement Information', th: 'ข้อมูลวงเงินสินเชื่อ' },
  jobInfoSectionLoanApplicants: { en: 'Loan Applicants', th: 'ผู้ขอสินเชื่อ' },
  jobInfoSectionLoanDetails: { en: 'Loan Details', th: 'รายละเอียดสินเชื่อ' },
  jobInfoSectionCollateralInformation: { en: 'Collateral Information', th: 'ข้อมูลหลักประกัน' },
  jobInfoFieldBranch: { en: 'Branch', th: 'สาขา' },
  jobInfoFieldLoanAgreementSigningDate: { en: 'Loan Agreement Signing Date', th: 'วันลงนามสัญญาสินเชื่อ' },
  jobInfoFieldSpouseConsentSigningDate: { en: 'Spouse Consent Signing Date', th: 'วันลงนามยินยอมคู่สมรส' },
  jobInfoFieldGuaranteeSigningDate: { en: 'Guarantee Agreement Signing Date', th: 'วันลงนามสัญญาค้ำประกัน' },
  jobInfoFieldMortgageDate: { en: 'Mortgage Date', th: 'วันจำนอง' },
  jobInfoFieldAppraisalPrice: { en: 'Appraisal Price', th: 'ราคาประเมิน' },
  jobInfoFieldSellingPrice: { en: 'Selling Price', th: 'ราคาขาย' },
  jobInfoFieldCfaTotalCreditLimitOriginal: { en: 'Total Credit Limit (Original)', th: 'วงเงินสินเชื่อรวม (เดิม)' },
  jobInfoFieldCfaTotalCreditLimitCurrent: { en: 'Total Credit Limit (Current)', th: 'วงเงินสินเชื่อรวม (ครั้งนี้)' },
  jobInfoFieldCfaIncrementAmount: { en: 'Increase/Decrease Amount', th: 'ครั้งนี้ เพิ่ม/ลด จำนวน' },
  jobInfoFieldCfaSigningDate: { en: 'CFA Signing Date', th: 'CFA เอ็นวันที่' },
  jobInfoFieldCfaRound: { en: 'CFA Round', th: 'CFA ครั้งที่' },
  jobInfoContractsTabsContracts: { en: 'Contracts', th: 'สัญญา' },
  jobInfoContractsTabsDocuments: { en: 'Documents', th: 'เอกสาร' },
  jobInfoContractsTabsComments: { en: 'Comments', th: 'ความคิดเห็น' },
  jobInfoContractsToastTitle: { en: 'Review Contracts', th: 'ตรวจสอบสัญญา' },
  jobInfoContractsToastMessage: { en: 'Please review the contracts and click \'Mark as Reviewed\' to confirm.', th: 'กรุณาตรวจสอบสัญญาและคลิก \'ทำเครื่องหมายว่าตรวจสอบแล้ว\' เพื่อยืนยัน' },
  jobInfoContractsListTitle: { en: 'List of Contracts', th: 'รายการสัญญา' },
  jobInfoContractsMarkAsReviewed: { en: 'Mark as Reviewed', th: 'ทำเครื่องหมายว่าตรวจสอบแล้ว' },
  jobInfoActionEdit: { en: 'Edit', th: 'แก้ไข' },
  jobInfoFooterCancel: { en: 'Cancel', th: 'ยกเลิก' },
  jobInfoFooterBack: { en: 'Back', th: 'ย้อนกลับ' },
  jobInfoFooterSubmit: { en: 'Submit', th: 'ยืนยัน' },
  jobInfoTableColumnId: { en: 'ID', th: 'รหัส' },
  jobInfoTableColumnName: { en: 'Name', th: 'ชื่อ' },
  jobInfoTableColumnRole: { en: 'Role', th: 'บทบาท' },
  jobInfoTableColumnIdCardNumber: { en: 'ID Card Number', th: 'หมายเลขบัตรประชาชน' },
  jobInfoTableColumnProductCode: { en: 'Product Code', th: 'รหัสผลิตภัณฑ์' },
  jobInfoTableColumnProductName: { en: 'Product Name', th: 'ชื่อผลิตภัณฑ์' },
  jobInfoTableColumnCreditLimit: { en: 'Credit Limit', th: 'วงเงินสินเชื่อ' },
  jobInfoTableColumnOutstandingBalance: { en: 'Outstanding Balance', th: 'ยอดคงเหลือ' },
  jobInfoTableColumnInterestRate: { en: 'Interest Rate', th: 'อัตราดอกเบี้ย' },
  jobInfoTableColumnLoanType: { en: 'Loan Type', th: 'ประเภทสินเชื่อ' },
  jobInfoTableColumnTenor: { en: 'Tenor', th: 'ระยะเวลา' },
  jobInfoTableColumnCollateralId: { en: 'Collateral ID', th: 'รหัสหลักประกัน' },
  jobInfoTableColumnCollateralType: { en: 'Collateral Type', th: 'ประเภทหลักประกัน' },
  jobInfoTableColumnTitleDeedNumber: { en: 'Title Deed Number', th: 'เลขโฉนด' },
  jobInfoTableColumnLandArea: { en: 'Land Area', th: 'เนื้อที่ดิน' },
  jobInfoTableColumnLocation: { en: 'Location', th: 'ที่ตั้ง' },
  jobInfoTagPpng: { en: 'ป.ป.ง.', th: 'ป.ป.ง.' },
  jobInfoTagUrgent: { en: 'Urgent', th: 'เร่งด่วน' },
  jobInfoLoadingText: { en: 'Loading job details...', th: 'กำลังโหลดรายละเอียดงาน...' },
  jobInfoErrorText: { en: 'Failed to load job details.', th: 'โหลดรายละเอียดงานไม่สำเร็จ' },
  jobInfoNoDataText: { en: 'No data available.', th: 'ไม่มีข้อมูล' },
  jobInfoCancelReasonLabel: { en: 'Cancel Reason', th: 'เหตุผลการยกเลิก' },
  jobInfoCancelReasonPlaceholder: { en: 'Enter reason for cancellation', th: 'ระบุเหตุผลการยกเลิก' },
  jobInfoCancelConfirm: { en: 'Confirm Cancel', th: 'ยืนยันการยกเลิก' },
  "jobInfo.page.title": { en: "Job Information", th: "ข้อมูลงาน" },
  "jobInfo.breadcrumb.backToWorkflow": { en: "Back to Workflow Management", th: "กลับสู่การจัดการงาน" },
  "jobInfo.header.jobDetails": { en: "Job Details", th: "รายละเอียดงาน" },
  "jobInfo.header.viewChanges": { en: "View Changes", th: "ดูการเปลี่ยนแปลง" },
  "jobInfo.header.saveChanges": { en: "Save Changes", th: "บันทึกการเปลี่ยนแปลง" },
  "jobInfo.section.generalInformation": { en: "General Information", th: "ข้อมูลทั่วไป" },
  "jobInfo.section.overallInformation": { en: "Overall Information", th: "ข้อมูลรวม" },
  "jobInfo.section.creditFacilityAgreement": { en: "Credit Facility Agreement Information", th: "ข้อมูลสัญญาวงเงินสินเชื่อ" },
  "jobInfo.section.loanApplicants": { en: "Loan Applicants", th: "ผู้กู้สินเชื่อ" },
  "jobInfo.section.loanDetails": { en: "Loan Details", th: "รายละเอียดสินเชื่อ" },
  "jobInfo.section.collateralInformation": { en: "Collateral Information", th: "ข้อมูลหลักประกัน" },
  "jobInfo.field.branch": { en: "Branch", th: "สาขา" },
  "jobInfo.field.loanAgreementSignDate": { en: "Loan Agreement Sign Date", th: "วันลงนามสัญญาสินเชื่อ" },
  "jobInfo.field.spouseConsentSignDate": { en: "Spousal Consent Sign Date", th: "วันลงนามยินยอมคู่สมรส" },
  "jobInfo.field.guaranteeAgreementSignDate": { en: "Guarantee Agreement Sign Date", th: "วันลงนามสัญญาค้ำประกัน" },
  "jobInfo.field.mortgageDate": { en: "Mortgage Date", th: "วันจำนอง" },
  "jobInfo.field.appraisedPrice": { en: "Appraised Price", th: "ราคาประเมิน" },
  "jobInfo.field.salePrice": { en: "Sale Price", th: "ราคาขาย" },
  "jobInfo.field.totalCreditLimitCurrent": { en: "Total Credit Limit (Current)", th: "วงเงินสินเชื่อรวม (เดิม)" },
  "jobInfo.field.totalCreditLimitThisTime": { en: "Total Credit Limit (This Time)", th: "วงเงินสินเชื่อรวม (ครั้งนี้)" },
  "jobInfo.field.creditLimitChangeAmount": { en: "Credit Limit Change Amount", th: "ครั้งนี้ เพิ่ม/ลด จำนวน" },
  "jobInfo.field.cfaAverageDate": { en: "CFA Average Date", th: "CFA เฉลี่ยวันที่" },
  "jobInfo.field.cfaRound": { en: "CFA Round", th: "CFA ครั้งที่" },
  "jobInfo.table.fullName": { en: "Full Name", th: "ชื่อ นามสกุล" },
  "jobInfo.table.age": { en: "Age", th: "อายุ" },
  "jobInfo.table.nationality": { en: "Nationality", th: "สัญชาติ" },
  "jobInfo.table.parentsNames": { en: "Parents Names", th: "ชื่อบิดา-มารดา" },
  "jobInfo.table.maritalStatus": { en: "Marital Status", th: "สถานภาพ" },
  "jobInfo.table.contactInfo": { en: "Contact Info", th: "ข้อมูลติดต่อ" },
  "jobInfo.badge.mainBorrower": { en: "Main Borrower", th: "ผู้กู้หลัก" },
  "jobInfo.badge.collateralOwner": { en: "Collateral Owner", th: "เจ้าของหลักประกัน" },
  "jobInfo.badge.urgent": { en: "Urgent", th: "เร่งด่วน" },
  "jobInfo.badge.pendingStart": { en: "Pending Start", th: "รอเริ่มต้น" },
  "jobInfo.contracts.tab": { en: "Contracts", th: "สัญญา" },
  "jobInfo.documents.tab": { en: "Documents", th: "เอกสาร" },
  "jobInfo.comments.tab": { en: "Comments", th: "ความคิดเห็น" },
  "jobInfo.contracts.reviewTitle": { en: "Review Contracts", th: "ตรวจสอบสัญญา" },
  "jobInfo.contracts.reviewDescription": { en: "Please review the contracts and click Mark as Reviewed to confirm.", th: "กรุณาตรวจสอบสัญญาและคลิก ทำเครื่องหมายว่าตรวจสอบแล้ว เพื่อยืนยัน" },
  "jobInfo.contracts.markAsReviewed": { en: "Mark as Reviewed", th: "ทำเครื่องหมายว่าตรวจสอบแล้ว" },
  "jobInfo.contracts.creditLimit": { en: "Credit Limit", th: "วงเงิน" },
  "jobInfo.action.edit": { en: "Edit", th: "แก้ไข" },
  "jobInfo.action.cancel": { en: "Cancel", th: "ยกเลิก" },
  "jobInfo.action.back": { en: "Back", th: "กลับ" },
  "jobInfo.action.submit": { en: "Submit", th: "ส่ง" },
  // Additional job-info keys
  jobInfoPageTitle: { en: "Job Information", th: "ข้อมูลงาน" },
  jobInfoBadgeMainBorrower: { en: "Main Borrower", th: "ผู้กู้หลัก" },
  jobInfoBadgeCollateralOwner: { en: "Collateral Owner", th: "เจ้าของหลักประกัน" },
  jobInfoBadgePendingStart: { en: "Pending Start", th: "รอเริ่มต้น" },
  jobInfoTableColumnAge: { en: "Age", th: "อายุ" },
  jobInfoTableColumnNationality: { en: "Nationality", th: "สัญชาติ" },
  jobInfoTableColumnParentsNames: { en: "Parents Names", th: "ชื่อบิดา-มารดา" },
  jobInfoTableColumnMaritalStatus: { en: "Marital Status", th: "สถานภาพ" },
  jobInfoTableColumnContactInfo: { en: "Contact Info", th: "ข้อมูลติดต่อ" },
  jobInfoContractsCreditLimit: { en: "Credit Limit", th: "วงเงิน" },
};

export type TranslationKey = keyof typeof translations;
