import { TextField, FormControl, Input } from "@mui/material";

export default function Page() {
  return (
    <div>
      <p>Customers Page</p>
      {/* <TextField /> */}
      <Input
        inputProps={{
          style: { borderWidth: 0 },
        }}
      />
    </div>
  );
}
