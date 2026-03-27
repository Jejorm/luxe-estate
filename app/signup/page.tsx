import { getDictionary } from '@/lib/i18n/getDictionary'
import SignUpForm from './SignUpForm'

export default async function SignUpPage() {
  const dict = await getDictionary()
  return <SignUpForm dict={dict} />
}
