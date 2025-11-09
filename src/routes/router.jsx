import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import NotFound from "../pages/NotFound";
import AllService from "../pages/AllService";
import Contact from "../pages/Contact";
import About from "../pages/About";
import News from "../pages/News";
import Notice from "../pages/Notice";
import Home from "../pages/Home";
import BloodDonorRegistration from "../pages/AllServicePage/Blood/BloodDonorRegistration";
import BloodDonorListing from "../pages/AllServicePage/Blood/BloodDonorListing";
import HospitalListPage from "../pages/AllServicePage/Hospital/HospitalListPage";
import DoctorListPage from "../pages/AllServicePage/Doctor/DoctorListPage";
import Ambulance from "../pages/AllServicePage/Ambulance/Ambulance";
import PoliceService from "../pages/AllServicePage/Police/PoliceService";
import FireServerce from "../pages/AllServicePage/FireServerce/FireServerce";
import BusTicketPage from "../pages/AllServicePage/BusTicket/BusTicketPage";
import RailwayService from "../pages/AllServicePage/Railway/RailwayService";
import Lawyer from "../pages/AllServicePage/Lawyer/Lawyer";
import AddLawyer from "../pages/AllServicePage/Lawyer/AddLawyer";
import WeatherPage from "../pages/AllServicePage/Weather/WeatherPage";
import Dashboard from "../Admin/Dashboard";
import Login from "../pages/Login"; // add login page
import PrivateRoute from "../routes/PrivateRoute"; // import
import ServicePage from "../pages/Dashboard/ServicePage";
import AdminBloodDonorList from "../pages/Dashboard/BloodAdmin/AdminBloodDonorList";
import AdminHospitalList from "../pages/Dashboard/HospitalAdmin/AdminHospitalList";
import HospitalForm from "../pages/Dashboard/HospitalAdmin/HospitalForm";
import AdminAmbulanceList from "../pages/Dashboard/AmbulanceAdmin/AdminAmbulanceList";
import DashboardFireStation from "../pages/Dashboard/FireServiceDashboard/DashboardFireStation";
import AddFireStation from "../pages/Dashboard/FireServiceDashboard/AddFireStation";
import EditFireStation from "../pages/Dashboard/FireServiceDashboard/EditFireStation"
import PoliceServiceManager from "../pages/Dashboard/PoliceAdmin/PoliceServiceManager";
import PoliceStationFormPage from "../pages/Dashboard/PoliceAdmin/PoliceStationFormPage";
import EditPoliceService from "../pages/Dashboard/PoliceAdmin/EditPoliceService";
import LawyerDashboard from "../pages/Dashboard/LawyerAdmin/LawyerDashboard";
import EditLawyer from "../pages/Dashboard/LawyerAdmin/EditLawyer";
import DestinationDashboard from "../pages/Dashboard/DestinationAdmin/DestinationDashboard";
import AddDestinationPage from "../pages/Dashboard/DestinationAdmin/AddDestinationPage";
import EditDestinationPage from "../pages/Dashboard/DestinationAdmin/EditDestinationPage";
import DestinationPage from "../pages/AllServicePage/Destination/DestinationPage";
import DestinationDetailPage from "../pages/AllServicePage/Destination/DestinationDetailPage";
import CourierServicePage from "../pages/AllServicePage/Courier/CourierServicePage";
import CourierServiceDashboard from "../pages/Dashboard/CourierAdmin/CourierServiceDashboard";
import EditCourierService from "../pages/Dashboard/CourierAdmin/EditCourierService";
import AddCourierService from "../pages/Dashboard/CourierAdmin/AddCourierService";
import EditHospital from "../pages/Dashboard/HospitalAdmin/EditHospital";
import DoctorDashboard from "../pages/Dashboard/DoctorAdmin/DoctorDashboard";
import AddDoctor from "../pages/Dashboard/DoctorAdmin/AddDoctor";
import EditDoctor from "../pages/Dashboard/DoctorAdmin/EditDoctor";
import AddAmbulance from "../pages/Dashboard/AmbulanceAdmin/AddAmbulance";
import EditAmbulance from "../pages/Dashboard/AmbulanceAdmin/EditAmbulance";
import RailwayAdmin from "../pages/Dashboard/RailwayDashboard/RailwayAdmin";
import AddStationPage from "../pages/Dashboard/RailwayDashboard/AddStationPage";
import EditStationPage from "../pages/Dashboard/RailwayDashboard/EditStationPage";
import JournalistAdmin from "../pages/Dashboard/JournalistAdmin/JournalistAdmin";
import JournalistPage from "../pages/AllServicePage/Journalist/JournalistPage";
import AddJournalist from "../pages/AllServicePage/Journalist/AddJournalist";
import EditJournalist from "../pages/Dashboard/JournalistAdmin/EditJournalist";
import BusAdmin from "../pages/Dashboard/BusAdmin/BusAdmin";
import AddBus from "../pages/Dashboard/BusAdmin/AddBus";
import EditBus from "../pages/Dashboard/BusAdmin/EditBus";
// Education imports
import EducationDashboard from "../pages/Dashboard/EducationAdmin/EducationDashboard";
import AddEducation from "../pages/Dashboard/EducationAdmin/AddEducation";
import EditEducation from "../pages/Dashboard/EducationAdmin/EditEducation";
import EducationPage from "../pages/AllServicePage/Education/EducationPage";
import EducationDetailsPage from "../pages/AllServicePage/Education/EducationDetailsPage";
// Electricity imports
import ElectricityDashboard from "../pages/Dashboard/Electricity/ElectricityDashboard";
import AddElectricity from "../pages/Dashboard/Electricity/AddElectricity";
import EditElectricity from "../pages/Dashboard/Electricity/EditElectricity";
import ElectricityPage from "../pages/AllServicePage/Current/ElectricityPage";
// Internet Provider imports
import InternetDashboard from "../pages/Dashboard/InternetProvider/InternetDashboard";
import AddInternetProvider from "../pages/Dashboard/InternetProvider/AddInternetProvider";
import EditInternetProvider from "../pages/Dashboard/InternetProvider/EditInternetProvider";
import InternetPage from "../pages/AllServicePage/Internet/InternetPage";
import AddInternetProviderFront from "../pages/AllServicePage/Internet/AddInternetProviderFront";
import NewsAdmin from "../pages/Dashboard/NewsAdmin/NewsAdmin";
import AddNews from "../pages/Dashboard/NewsAdmin/AddNews";
import EditNews from "../pages/Dashboard/NewsAdmin/EditNews";
import NewsDetails from "../pages/NewsDetails";
import NoticeAdmin from "../pages/Dashboard/NoticeAdmin/NoticeAdmin";
import AddNotice from "../pages/Dashboard/NoticeAdmin/AddNotice";
import EditNotice from "../pages/Dashboard/NoticeAdmin/EditNotice";
import NoticeDetails from "../pages/NoticeDetails";
// E-Service imports
import EserviceAdmin from "../pages/Dashboard/E-sebaAdmin.jsx/EserviceAdmin";
import AddEservice from "../pages/Dashboard/E-sebaAdmin.jsx/AddEservice";
import EditEservice from "../pages/Dashboard/E-sebaAdmin.jsx/EditEservice";
import EservicePage from "../pages/AllServicePage/E-Service/EservicePage";
import EserviceDetails from "../pages/AllServicePage/E-Service/EserviceDetails";
import UnionAdmin from "../pages/Dashboard/UnionAdmin/UnionAdmin";
import AddUnion from "../pages/Dashboard/UnionAdmin/AddUnion";
import EditUnion from "../pages/Dashboard/UnionAdmin/EditUnion";
import UnionPage from "../pages/AllServicePage/Union/UnionPage";
import UnionDetails from "../pages/AllServicePage/Union/UnionDetails";
import WaterAdmin from "../pages/Dashboard/WaterAdmin./WaterAdmin";
import AddWaterOffice from "../pages/Dashboard/WaterAdmin./AddWaterOffice";
import EditWaterOffice from "../pages/Dashboard/WaterAdmin./EditWaterOffice";
import WaterOfficePage from "../pages/AllServicePage/Gas-Water/WaterOfficePage";
import WaterOfficeDetails from "../pages/AllServicePage/Gas-Water/WaterOfficeDetails";
import MunicipalityAdmin from "../pages/Dashboard/Municipality/MunicipalityAdmin";
import AddMunicipality from "../pages/Dashboard/Municipality/AddMunicipality";
import EditMunicipality from "../pages/Dashboard/Municipality/EditMunicipality";
import MunicipalityPage from "../pages/AllServicePage/Municipality/MunicipalityPage";
import MunicipalityDetails from "../pages/AllServicePage/Municipality/MunicipalityDetails";
// Restaurant Admin imports
import RestaurantAdmin from "../pages/Dashboard/RestaurantAdmin/RestaurantAdmin";
import EditRestaurant from "../pages/Dashboard/RestaurantAdmin/EditRestaurant";
// Restaurant Public imports
import AddRestaurant from "../pages/Dashboard/RestaurantAdmin/AddRestaurant";
import RestaurantPage from "../pages/AllServicePage/Restaurants/RestaurantPage";
import RestaurantDetails from "../pages/AllServicePage/Restaurants/RestaurantDetails";
// Event Admin imports
import EventAdmin from "../pages/Dashboard/EventAdmin/EventAdmin";
import AddEvent from "../pages/Dashboard/EventAdmin/AddEvent";
import UpdateEvent from "../pages/Dashboard/EventAdmin/UpdateEvent";
// Event Public imports
import EventPage from "../pages/AllServicePage/Events/EventPage";
import EventDetails from "../pages/AllServicePage/Events/EventDetails";
// Rent Car Admin imports
import RentCarAdmin from "../pages/Dashboard/RentCarAdmin/RentCarAdmin";
import AddRentCar from "../pages/Dashboard/RentCarAdmin/AddRentCar";
import UpdateRentCar from "../pages/Dashboard/RentCarAdmin/UpdateRentCar";
// Rent Car Public imports
import RentCarPage from "../pages/AllServicePage/RentCar/RentCarPage";
import RentCarDetails from "../pages/AllServicePage/RentCar/RentCarDetails";
// Blog Admin imports
import BlogsPage from "../pages/AllServicePage/Blogs/BlogsPage";
import BlogDetails from "../pages/AllServicePage/Blogs/BlogDetails";
import AddBlog from "../pages/AllServicePage/Blogs/AddBlog";
import BlogsAdmin from "../pages/Dashboard/BlogsAdmin/BlogsAdmin";
import EditBlog from "../pages/Dashboard/BlogsAdmin/EditBlog";
import DisasterPage from "../pages/AllServicePage/Disaster/DisasterPage";
import AddDisasterReport from "../pages/AllServicePage/Disaster/AddDisasterReport";
import OurBogura from "../pages/ourBogura";
import Privacy from "../pages/Privacy";
import Terms from "../pages/Terms";
import Sitemap from "../pages/Sitemap";
import OurBoguraAdmin from "../pages/Dashboard/OurBoguraAdmin/OurBoguraAdmin";
import AddFamousPerson from "../pages/Dashboard/OurBoguraAdmin/AddFamousPerson";
import EditFamousPerson from "../pages/Dashboard/OurBoguraAdmin/EditFamousPerson";
import OurBoguraDetails from "../pages/OurBoguraDetails";
import AllFamousPerson from "../pages/AllFamousPerson";
import BoguraHistory from "../pages/BoguraHistory";
import BoguraCulture from "../pages/BoguraCulture";
import ContactAdmin from "../pages/Dashboard/Contact/ContactAdmin";
import AdsPage from "../pages/AdsPage";
import AdsDetails from "../pages/AdsDetails";
import AdsAdmin from "../pages/Dashboard/AdsAdmin/AdsAdmin";
import ContentCreatorPage from "../pages/ContentCreatorPage/ContentCreatorPage";
import AddContentCreator from "../pages/ContentCreatorPage/AddContentCreator";
import ContentCreatorDetails from "../pages/ContentCreatorPage/ContentCreatorDetails";
import ContentCreatorAdmin from "../pages/Dashboard/ContentCreatorAdmin";
import SliderAdmin from "../pages/Dashboard/SliderAdmin/SliderAdmin";
import PartnersAdmin from "../pages/Dashboard/PartnersAdmin/PartnersAdmin";
import DisasterAdmin from "../pages/Dashboard/DisasterAdmin/DisasterAdmin";
import DisasterDetails from "../pages/AllServicePage/Disaster/DisasterDetails";
import ElectionCenter from "../pages/Election/ElectionCenter";
import Polls from "../pages/Election/Polls";
import PollDetails from "../pages/Election/PollDetails";
import Candidates from "../pages/Election/Candidates";
import CandidateDetails from "../pages/Election/CandidateDetails";
import Assistance from "../pages/Election/Assistance";
import Insights from "../pages/Election/Insights";
import ElectionNews from "../pages/Election/ElectionNews";
import ElectionAdmin from "../pages/Dashboard/ElectionAdmin/ElectionAdmin";
import PollsAdmin from "../pages/Dashboard/ElectionAdmin/PollsAdmin";
import ManagePolls from "../pages/Dashboard/ElectionAdmin/ManagePolls";
import CandidatesAdmin from "../pages/Dashboard/CandidatesAdmin/CandidatesAdmin";
import CandidatesList from "../pages/Dashboard/CandidatesAdmin/CandidatesList";
import EditCandidate from "../pages/Dashboard/CandidatesAdmin/EditCandidate";
import AssistanceInfoList from "../pages/Dashboard/VoterAssistanceDashboard/AssistanceInfoList";
import VotingCenterList from "../pages/Dashboard/VoterAssistanceDashboard/VotingCenterList";
import AnnouncementsList from "../pages/Dashboard/VoterAssistanceDashboard/AnnouncementsList";
import VoterAssistanceDashboard from "../pages/Dashboard/VoterAssistanceDashboard/VoterAssistanceDashboard";
import VotingDayAssistance from "../pages/Election/VotingDayAssistance";


const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: "services", element: <AllService /> },
      { path: "bogura-intro", element: <OurBogura /> },
      { path: "ourBogura", element: <OurBogura /> },
      { path: "all-famous-person", element: <AllFamousPerson /> },
      { path: "history", element: <BoguraHistory /> },
      { path: "famous/:id", element: <OurBoguraDetails /> },
      { path: "culture", element: <BoguraCulture /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },
      { path: "privacy", element: <Privacy /> },
      { path: "terms", element: <Terms /> },
      { path: "sitemap", element: <Sitemap /> },
      { path: "news", element: <News /> },
      { path: "news/:id", element: <NewsDetails /> },
      { path: "notice", element: <Notice /> },
      { path: "notice/:id", element: <NoticeDetails /> },
      { path: "all-blood", element: <BloodDonorListing /> },
      { path: "add-donor", element: <BloodDonorRegistration /> },
      { path: "hospital-list", element: <HospitalListPage /> },
      { path: "doctor-list", element: <DoctorListPage /> },
      { path: "ambulance", element: <Ambulance /> },
      { path: "police", element: <PoliceService /> },
      { path: "journalistsPage", element: <JournalistPage></JournalistPage> },
      { path: "add-journalist", element: <AddJournalist></AddJournalist>},
      { path: "fire-service", element: <FireServerce /> },
      { path: "bus-ticket", element: <BusTicketPage /> },
      { path: "rail-service", element: <RailwayService /> },
      { path: "lawyers", element: <Lawyer /> },
      { path: "add-lawyer", element: <AddLawyer /> },
      { path: "weather", element: <WeatherPage /> },
      { path: "destinationData", element: <DestinationPage></DestinationPage> },
      { path: "destinatonDetails", element: <DestinationDetailPage /> },
      { path: "courier", element: <CourierServicePage></CourierServicePage> },
      { path: "education", element: <EducationPage /> },
      { path: "education/:id", element: <EducationDetailsPage /> },
      { path: "electricity", element: <ElectricityPage /> },
      { path: "internet", element: <InternetPage /> },
      { path: "add-internet-provider", element: <AddInternetProviderFront /> },
      { path: "eservice", element: <EservicePage /> },
      { path: "eservice/:id", element: <EserviceDetails /> },
      { path: "union", element: <UnionPage /> },
      { path: "union/:id", element: <UnionDetails /> },
      { path: "water-offices", element: <WaterOfficePage /> },
      { path: "water-office/:id", element: <WaterOfficeDetails /> },
      { path: "municipalities", element: <MunicipalityPage /> },
      { path: "municipality/:id", element: <MunicipalityDetails /> },
      { path: "restaurants", element: <RestaurantPage /> },
      { path: "add-restaurant", element: <AddRestaurant /> },
      { path: "restaurant/:id", element: <RestaurantDetails /> },
      { path: "events", element: <EventPage /> },
      { path: "add-event", element: <AddEvent /> },
      { path: "event/:id", element: <EventDetails /> },
      { path: "rent-cars", element: <RentCarPage /> },
      { path: "rent-car-details/:id", element: <RentCarDetails /> },
      { path: "add-rent-car", element: <AddRentCar /> },
      { path: "blogs", element: <BlogsPage /> },
      { path: "blog/:id", element: <BlogDetails /> },
      { path: "add-blog", element: <AddBlog /> },
      { path: "disaster-reports", element: <DisasterPage /> },
      { path: "disaster-report/add", element: <AddDisasterReport /> },
      { path: "disaster-report/:id", element: <DisasterDetails /> },
      { path: "ads", element: <AdsPage /> },
      { path: "ads/:id", element: <AdsDetails /> },
      { path: "content-creators", element: <ContentCreatorPage /> },
      { path: "add-content-creator", element: <AddContentCreator /> },
      { path: "content-creator/:id", element: <ContentCreatorDetails /> },
      // Election & Civic Center
      { path: "election", element: <ElectionCenter /> },
      { path: "election/polls", element: <Polls /> },
      { path: "election/polls/:id", element: <PollDetails /> },
      { path: "election/candidates", element: <Candidates /> },
      { path: "election/candidates/:id", element: <CandidateDetails /> },
      { path: "election/assistance", element: <Assistance /> },
      { path: "election/insights", element: <Insights /> },
      { path: "election/news", element: <ElectionNews /> },
      { path: "election/voting-day-assistance", element: <VotingDayAssistance /> },
    ],
  },
  {
    path: "/login",
    element: <Login />, // Login page route
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
    children: [
      {
        path: "backService",
        Component: ServicePage
      },
      {
        path: "adminblood",
        Component: AdminBloodDonorList
      },
      {
        path: "addHospital",
        Component: AdminHospitalList
      },
      {
        path: "add-hospital",
        Component: HospitalForm
      },
      {
        path: "edit-hospital/:id",
        Component: EditHospital
      },
      {
        path: "adminAmbulance",
        Component: AdminAmbulanceList
      },
      {
        path: "add-ambulance",
        Component: AddAmbulance
      },
      {
        path: "edit-ambulance/:id",
        Component: EditAmbulance
      },
      {
        path: "fire-station",
        Component: DashboardFireStation
      },
      {
        path: "add-fire-station",
        Component: AddFireStation
      },
      {
        path: "edit-fire-station/:id",
        Component: EditFireStation
      },
      {
        path: "police",
        Component: PoliceServiceManager
      },
      {
        path: "police-add",
        Component: PoliceStationFormPage
      },
      {
        path: 'police-edit/:id',
        Component: EditPoliceService
      },
      {
        path: "lawyerslist",
        Component: LawyerDashboard
      },
      {
        path: 'edit-lawyer/:id',
        Component: EditLawyer
      },
      {
        path: "destinations-list",
        Component: DestinationDashboard
      },
      {
        path: "add-destination",
        Component: AddDestinationPage
      },
      {
        path: "edit-destination/:id",
        Component: EditDestinationPage
      },

      {
        path: "courier-service",
        Component: CourierServiceDashboard
      },
      {
        path: "edit-courier/:id",
        Component: EditCourierService
      },
      {
        path: "add-courier",
        Component: AddCourierService
      },
      {
        path: "doctorlist",
        Component: DoctorDashboard
      },
      {
        path: "add-doctor",
        Component: AddDoctor
      },
      {
        path: 'edit-doctors/:id',
        Component: EditDoctor
      },
      {
        path: "rail-service",
        Component: RailwayAdmin
      },
      {
        path: "add-station",
        Component: AddStationPage
      },
      {
        path: "edit-railway/:id",
        Component: EditStationPage
      },
      {
        path: "journalists",
        Component: JournalistAdmin
      },
      {
        path: "edit-journalist/:id",
        Component: EditJournalist
      },
      {
        path: "bus-admin",
        Component: BusAdmin
      },
      {
        path: "add-bus",
        Component: AddBus
      },
      {
        path: "edit-bus/:id",
        Component: EditBus
      },
      // Education routes
      {
        path: "education",
        Component: EducationDashboard
      },
      {
        path: "add-education",
        Component: AddEducation
      },
      {
        path: "edit-education/:id",
        Component: EditEducation
      },
      // Electricity routes
      {
        path: "electricity",
        Component: ElectricityDashboard
      },
      {
        path: "add-electricity",
        Component: AddElectricity
      },
      {
        path: "edit-electricity/:id",
        Component: EditElectricity
      },
      // Internet Provider routes
      {
        path: "internet-dashboard",
        Component: InternetDashboard
      },
      {
        path: "add-internet",
        Component: AddInternetProvider
      },
      {
        path: "edit-internet/:id",
        Component: EditInternetProvider
      },
      // News Admin routes
      {
        path: "news-admin",
        Component: NewsAdmin
      },
      {
        path: "add-news",
        Component: AddNews
      },
      {
        path: "edit-news/:id",
        Component: EditNews
      },
      // Notice Admin routes
      {
        path: "notice",
        Component: NoticeAdmin
      },
      {
        path: "add-notice",
        Component: AddNotice
      },
      {
        path: "edit-notice/:id",
        Component: EditNotice
      },
      // E-Service Admin routes
      {
        path: "eservice-admin",
        Component: EserviceAdmin
      },
      {
        path: "add-eservice",
        Component: AddEservice
      },
      {
        path: "edit-eservice/:id",
        Component: EditEservice
      },
      {
        path: "union-digital",
        Component: UnionAdmin
      },
      {
        path: "add-union",
        Component: AddUnion
      },
      {
        path: "edit-union/:id",
        Component: EditUnion
      },
      {
        path: "water-admin",
        Component: WaterAdmin
      },
      {
        path: "add-water-office",
        Component: AddWaterOffice
      },
      {
        path: "edit-water-office/:id",
        Component: EditWaterOffice
      },
      // Municipality Admin routes
      {
        path: "municipality-admin",
        Component: MunicipalityAdmin
      },
      {
        path: "add-municipality",
        Component: AddMunicipality
      },
      {
        path: "edit-municipality/:id",
        Component: EditMunicipality
      },
      // Restaurant Admin routes
      {
        path: "restaurant-admin",
        Component: RestaurantAdmin
      },
      {
        path: "edit-restaurant/:id",
        Component: EditRestaurant
      },
      // Event Admin routes
      {
        path: "event-admin",
        Component: EventAdmin
      },
      {
        path: "add-event",
        Component: AddEvent
      },
      {
        path: "update-event/:id",
        Component: UpdateEvent
      },
      // Rent Car Admin routes
      {
        path: "rent-car-admin",
        Component: RentCarAdmin
      },
      {
        path: "update-rent-car/:id",
        Component: UpdateRentCar
      },
      // Blog Admin routes
      {
        path: "blogs-admin",
        Component: BlogsAdmin
      },
      {
        path: "edit-blog/:id",
        Component: EditBlog
      },
      {
        path: "bogura-intro",
        Component: OurBoguraAdmin
      },
      {
        path: "add-famous-person",
        Component: AddFamousPerson
      },
      {
        path: "famous-edit/:id",
        Component: EditFamousPerson
      },
      {
        path: "contact",
        Component: ContactAdmin
      },
      {
        path: "ads-admin",
        Component: AdsAdmin
      },
      {
        path: "content-creator-admin",
        Component: ContentCreatorAdmin
      },
      {
        path: "slider-admin",
        Component: SliderAdmin
      }
      ,
      {
        path: "election-admin",
        Component: ElectionAdmin
      },
      {
        path: "election-candidates",
        Component: CandidatesAdmin
      },
      {
        path: "election-candidates-list",
        Component: CandidatesList
      },
      {
        path: "election-candidates-edit/:id",
        Component: EditCandidate
      },
      {
        path: "voter-assistance",
        Component: VoterAssistanceDashboard
      },
      {
        path: "assistance-info-list",
        Component: AssistanceInfoList
      },
      {
        path: "voting-center-list",
        Component: VotingCenterList
      },
      {
        path: "announcements-list",
        Component: AnnouncementsList
      },
      {
        path: "election-polls",
        Component: PollsAdmin
      },
      {
        path: "manage-polls",
        Component: ManagePolls
      },
      {
        path: "partners-admin",
        Component: PartnersAdmin
      },
      {
        path: "disaster-admin",
        Component: DisasterAdmin
      }
    ],
  },
]);

export default router;
