import bcrypt from "bcrypt";

const CompPassword=async (password,currPass)=>{
    console.log(password,currPass);
    const isPassword=await bcrypt.compare(password,currPass)
return isPassword;
}
export default CompPassword;