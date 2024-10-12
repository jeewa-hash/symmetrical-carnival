import React from 'react';
import Header from './Shared/Header.jsx';
import Footer from './Shared/Footer.jsx';
import Financeuserinterface from './financehandling/financeuserinterface.jsx';
import Salarycalculateinterface from './financehandling/salarycalculateinterface.jsx';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Orderbillinterface from './financehandling/orderbillinterface.jsx';
import Home from './Home/Home.jsx';
import Salaryret from './financehandling/salaryret.jsx';
import FIMainTable from './financehandling/fiMainTable.jsx';
import Billorderret from './financehandling/billorderret.jsx';
import Salaryupdate from './financehandling/salaryupdate.jsx'; 
import RegistrationForm from './Registration/Registration.jsx';
import { NotificationProvider } from './notification/notificatioonContext.jsx'; 
import NotificationDropdown from './notification/notifidropdown.jsx'; 
import OrderAndProduction from './OrderAndProductionUi/OrderAndProduction.jsx';
import ProductionManagementSystem from './ProductionManagement/productionPlaning.jsx';
import OrderManagementSystem from './OrderManagement/order.jsx';
import OrderRet from './OrderManagement/orderRet.jsx';
import ResourcePlanningSystem from './ProductionManagement/ResourcesPlaning.jsx';
import ResourceRetriew from './ProductionManagement/ResourceRet.jsx';
import ProductionRet from './ProductionManagement/ProductionRet.jsx';
import ProductionCostCalculator from './ProductionManagement/productionCost.jsx';
import OrderAndProductionReport from './OrderandProductionReport/OrderandProductionReport.jsx';
import LoginForm from './Login/loginForm.jsx';
import AboutUs from './OrderAndProductionUi/AboutUs.jsx';
import IMInterface from './InventoryManagement/Interface.jsx';
import Inventory from './InventoryManagement/Inventory.jsx';
import FinishGoods from './InventoryManagement/FinishGoods.jsx';
import RawDataTable from './InventoryManagement/RawDataTable.jsx';
import RawMaterialRequest from './InventoryManagement/RawMaterialRequest.jsx';
import MonthlyEvaluation from './InventoryManagement/MonthlyEvalution.jsx';
import ProductionRequest from './InventoryManagement/ProductionRequest.jsx';
import HRManagementInterface from './HRManagementInterface/HRInterface.jsx';
import LeaveRequestForm from './leaveReqForm/LeaveForm.jsx';
import LeaveRet from './LeaveRetrive/LeaveRet.jsx';
import SalaryMang from './SalaryMangment/SalaryMang.jsx';
import Supplierui from '/../Yashira/frontend/src/components/financeInterface/FinanceUserInterface';
import Dashboard from '/../Yashira/frontend/src/components/dashbord/Dashbord';
import OrderList from '/../Yashira/frontend/src/components/orderlist/OrderList';
import MakeOrder from '/../Yashira/frontend/src/components/makeorders/MakeOrders';
import SalaryRet from './SalaryDetailsRet/SalaryRet.jsx';
import Sidebar from '/../Yashira/frontend/src/components/sidebar/SideBar';
import Financedashboard from './financehandling/Financedashboard.jsx';
import HRDashboard from './DashBoardHR/HRDashboard.jsx';
import Addemp from './AddEmp/Addemp.jsx';
import EmpRet from './AddEmpRet/empRet.jsx';
import AttendanceTrackingForm from './AttendanceT/Attencance.jsx';
import ARet from './ATrackingRet/ARet.jsx';
import HRManagementReport from './HRreport/HRreport.jsx';
import AttendanceForm from './Attendence/atten.jsx';
import EditEmployee from './AddEmpRet/editemp.jsx';
import Report from './getreport/Report.jsx';
import AddReport from './addreport/AddReport.jsx';
import DashBoard from './Dashboard/DashBoardsathi.jsx';
import UpdateReport from './updatereport/updateReport.jsx';
import Tracker from './map/tracker.jsx';
import RegisterSupplier from '/../Yashira/frontend/src/components/registerSupplier/RegisterSupplier';
import SupplierList from '/../Yashira/frontend/src/components/registerSupplier/SupplierList';
import View from './viewslidebar/viewtashorder.jsx'
import Interface from '/../symmetrical-carnival-main/frontend/src/Interface/Interface';
import CatalogM from '/../symmetrical-carnival-main/frontend/src/MarketingManagement/CatalogM';
import CartPage from '/../symmetrical-carnival-main/frontend/src/MarketingManagement/CartPage';
import RetrieveCartPage from '/../symmetrical-carnival-main/frontend/src/MarketingManagement/RetrieveCartPage';
import PromotionManagement from '/../symmetrical-carnival-main/frontend/src/PromotionManagement/Promotion';
import ShopRegistration from '/../symmetrical-carnival-main/frontend/src/ShopReqestration/ShopRegistration';
import ShopList from '/../symmetrical-carnival-main/frontend/src/ShopReqestration/ShopRegRet';
import ReportPage from '/../symmetrical-carnival-main/frontend/src/Report/ReportPage';
import Hrreport from './HRreport/HRreport.jsx';
import Freport from './financehandling/financereport.jsx'
import Empdetails from './viewslidebar/viewtashorder.jsx'
import Deli from './updatereport/interface.jsx'
const App = () => {
  return (
    <NotificationProvider> 
      <Router>
        <div>
          <Header />
          
        <div>
          
          </div>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<RegistrationForm />} />
              <Route path="/financeui" element={<Financeuserinterface />} />
              <Route path="/orderandproductionui" element={<OrderAndProduction />} />
              <Route path="/orderandproductionui/production" element={<ProductionManagementSystem />} />
              <Route path="/financeui/salarycalculateinterface" element={<Salarycalculateinterface />} />
              <Route path="/financeui/orderbillinterface" element={<Orderbillinterface />} />
              <Route path="/salaryret" element={<Salaryret />} />
              <Route path="/financeui/ftable" element={<FIMainTable />} />
              <Route path="/financeui/freport" element={<Freport />} />
              <Route path="/orders" element={<Billorderret />} />
              <Route path="/salary-update/:employeeId" element={<Salaryupdate />} />
              <Route path="/orderandproductionui/order" element={<OrderManagementSystem />} />
              <Route path="/orderret" element={<OrderRet/>} />
              <Route path="/orderandproductionui/resources" element={<ResourcePlanningSystem />} />
              <Route path="/Resourcetret" element={<ResourceRetriew/>} />
              <Route path="/productret" element={<ProductionRet/>} />
              <Route path="/orderandproductionui/cost" element={<ProductionCostCalculator/>} />
              <Route path="/orderandproductionui/report" element={<OrderAndProductionReport />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/aboutus" element={<AboutUs />} />
              <Route path="/inventoryui" element={<IMInterface />} />
              <Route path='/inventory' element={<Inventory />} />
              <Route path="/finishgoods" element={<FinishGoods />} />
              <Route path="/rawdatatable" element={<RawDataTable />} />
              <Route path="/rawmaterialrequest" element={<RawMaterialRequest />} />
              <Route path="/monthlyevaluation" element={<MonthlyEvaluation />} />
              <Route path="/productionrequest" element={<ProductionRequest />} />
              <Route path="/hrui" element={<HRManagementInterface />} />
              <Route path="/hrui/leaveform" element={<LeaveRequestForm />} />
              <Route path="/leavetable" element={<LeaveRet/>} />
              <Route path="/hrui/salarymang" element={<SalaryMang />} />
              <Route path="/supplierui" element={<Supplierui />} />
              <Route path="/salarytable" element={<SalaryRet/>} />
              <Route path="/hrui/dashboard" element={<HRDashboard/>} />
              <Route path="/hrui/addemp" element={<Addemp />} />
              <Route path="/emptable" element={<EmpRet/>} />
              <Route path="/hrui/attendancetrack" element={<AttendanceTrackingForm />} />
              <Route path="/attetable" element={<ARet/>} />
              <Route path="/leaveform" element={<LeaveRequestForm />} />
              <Route path="/hr-report" element={<HRManagementReport />} />
              <Route path="/attendance" element={<AttendanceForm />} />
              <Route path="/leavetable" element={<LeaveRet/>} />
              <Route path="/edit-employee/:id" element={<EditEmployee />} />
              <Route path="/list" element={<Report  />} />
              <Route path="/add" element={<AddReport />} />
              <Route path="/dashboard" element={<DashBoard />} />
              <Route path="/update/:id" element={<UpdateReport />} />
              <Route path="/map" element={<Tracker />} />
              <Route path="/salesui" element={<Interface/>}/>
              <Route path="/salesui/catalog" element={<CatalogM/>}/>
              <Route path="/salesui/cart" element={<CartPage/>}/>
              <Route path="/salesui/cartRet" element={<RetrieveCartPage/>}/>
              <Route path="/salesui/promo" element={<PromotionManagement/>}/>
              <Route path="/salesui/shop" element={<ShopRegistration/>}/>
              <Route path="/salesui/shoplist" element={<ShopList/>}/>
              <Route path="/salesui/report" element={<ReportPage/>}/>
              <Route path="/hrui/hr-report" element={<Hrreport/>}/>
              <Route path="/empdetails" element={<Empdetails/>}/>
              <Route path="/deliveryui" element={<Deli  />} />
            </Routes>
            
            <div>
             <Sidebar />
             <Routes>
             <Route path="/dashbord" element={<Dashboard />} />
              <Route path="/supplierui/order-list" element={<OrderList />} />
              <Route path="/supplierui/make-order" element={<MakeOrder />} />
              <Route path="/supplier" element={<RegisterSupplier />} />
              <Route path="/supplier-List" element={<SupplierList />} />
              <Route path="/make-order" element={<MakeOrder />} />
              <Route path="/order-list" element={<OrderList />} />
             </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </NotificationProvider>
  );
};

export default App;