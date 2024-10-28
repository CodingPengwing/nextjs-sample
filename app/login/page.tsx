// import AcmeLogo from "@/app/ui/acme-logo";
// import LoginForm from "@/app/ui/login-form";

// export default function LoginPage() {
//   return (
//     <main className="flex items-center justify-center md:h-screen">
//       <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
//         <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36">
//           <div className="w-32 text-white md:w-36">
//             <AcmeLogo />
//           </div>
//         </div>
//         <LoginForm />
//       </div>
//     </main>
//   );
// }
"use client";
// import { Link } from "react-router-dom";

// material-ui
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

// project import
import AuthWrapper from "./AuthWrapper";
import AuthLogin from "./AuthLogin";

// ================================|| LOGIN ||================================ //

export default function Login() {
  return (
    <AuthWrapper>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="baseline"
            sx={{ mb: { xs: -0.5, sm: 0.5 } }}
          >
            <Typography variant="h3">Login</Typography>
            {/* <Typography
              component={Link}
              to="/register"
              variant="body1"
              sx={{ textDecoration: "none" }}
              color="primary"
            >
              Don&apos;t have an account?
            </Typography> */}
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <AuthLogin />
        </Grid>
      </Grid>
    </AuthWrapper>
  );
}
