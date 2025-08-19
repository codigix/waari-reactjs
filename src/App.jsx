import { lazy, Suspense, useEffect } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { checkAutoLogin } from "./services/AuthService";
import { ToastContainer } from "react-toastify";
import Index from "./jsx";
import "./css/style.css";
import Feedbackform from "./jsx/pages/Feedbackform";
import { get } from "./services/apiServices";
import { useDispatch, useSelector } from "react-redux";
import { setPermissions } from "./store/actions/authActions";
import OTPVerify from "./jsx/pages/OTPVerify";
import ForgotPassword from "./jsx/pages/ForgotPassword";
import VerifyForgetPasswordOTP from "./jsx/pages/VerifyForgetPasswordOTP";

const Login = lazy(() =>
	new Promise((resolve) => {
		setTimeout(() => resolve(import("./jsx/pages/Login")), 500);
	})
);

function App() {
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const dispatch = useDispatch();
	const { token } = useSelector((state) => state.auth);

	// Auto login check
	useEffect(() => {
		if (
			!pathname.includes("feedback-form") &&
			!pathname.includes("verify-otp")
		) {
			checkAutoLogin(navigate);
		}
	}, [pathname, navigate]);

	// Fetch permissions if logged in
	useEffect(() => {
		const fetchPermissions = async () => {
			try {
				const response = await get(`/role/test-permission`);
				console.log("permissions", response.data.permissions);
				dispatch(setPermissions(response?.data?.permissions));
			} catch (error) {
				console.error("Error fetching permissions:", error);
			}
		};

		if (token) {
			fetchPermissions();
		}
	}, [token, dispatch]);

	const routeblog = (
		<Routes>
			<Route path="/login" element={<Login />} />
			<Route path="/verify-otp" element={<OTPVerify />} />
			<Route path="/forgot-password" element={<ForgotPassword />} />
			<Route
				path="/verify-forget-password-otp"
				element={<VerifyForgetPasswordOTP />}
			/>
			<Route path="/feedback-form" element={<Feedbackform />} />
		</Routes>
	);

	const toastConfig = {
		position: "bottom-right",
		autoClose: 5000,
		hideProgressBar: false,
		newestOnTop: false,
		closeOnClick: true,
		rtl: false,
		pauseOnFocusLoss: true,
		draggable: true,
		pauseOnHover: true,
		theme: "colored",
		closeButton: (
			<button
				style={{
					width: "30px",
					backgroundColor: "inherit",
					border: "none",
					color: "white",
				}}
			>
				X
			</button>
		),
	};

	if (localStorage.getItem("token")) {
		return (
			<>
				<Index />
				<ToastContainer {...toastConfig} />
			</>
		);
	} else {
		return (
			<div className="vh-100">
				<Suspense
					fallback={
						<div id="preloader">
							<div className="sk-three-bounce">
								<div className="sk-child sk-bounce1"></div>
								<div className="sk-child sk-bounce2"></div>
								<div className="sk-child sk-bounce3"></div>
							</div>
						</div>
					}
				>
					{routeblog}
					<ToastContainer {...toastConfig} />
				</Suspense>
			</div>
		);
	}
}

export default App;
