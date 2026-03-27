import { getDictionary } from '@/lib/i18n/getDictionary'
import LoginForm from './LoginForm'

export default async function LoginPage() {
  const dict = await getDictionary()
  return <LoginForm dict={dict} />
}
