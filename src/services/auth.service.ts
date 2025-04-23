import bcrypt from 'bcrypt';
import { User } from '@models/user.model';
import { generateToken } from '@utils/jwt';
import { sendEmail } from '@utils/email';

export const signup = async (name: string, email: string, password: string) => {
  const existing = await User.findOne({ email });
  if (existing) throw new Error('User already exists');

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword });

  try {
    await sendEmail(
      email,
      'Welcome to Support System',
      `Hi ${name},\n\nThank you for signing up. You can now create support tickets anytime.\n\nCheers,\nSupport Team`
    );
  } catch (error) {
    console.log('📧 Failed to send welcome email:', error); // or console.error
  }
  //return generateToken({ id: user._id });
  return generateToken({ id: user._id, email: user.email, name: user.name });
};

export const login = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Invalid email or password');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid email or password');

  try{
  await sendEmail(
    email,
    'Login Notification',
    `Hi ${user.name},\n\nYou just logged into your support account.\n\nIf this wasn’t you, please reset your password immediately.\n\nCheers,\nSupport Team`
  );
}catch(error){
  console.log('📧 Failed to send welcome email:', error); // or console.error
}
  return generateToken({ id: user._id, email: user.email, name: user.name });
  //return generateToken({ id: user._id });
};
