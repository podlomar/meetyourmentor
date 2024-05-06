import Button from 'components/Button';
import Page from 'components/Page';
import { isAdmin } from 'lib/is-admin';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation'

const LoginPage = async (): Promise<JSX.Element> => {
  const login = async (formData: FormData) => {
    'use server';

    const password = String(formData.get('password'));
    if (password !== process.env.ADMIN_PWD) {
      return;
    }

    cookies().set('adminPwd', String(password));
    redirect('/');
  };

  const logout = async () => {
    'use server';
    cookies().delete('adminPwd');
    redirect('/');
  }

  const userIsAdmin = isAdmin();

  return (
    <Page title="Login">
      {userIsAdmin ? (
        <>
          <p>Jste již přihlášeni jako administrátor.</p>
          <form action={logout}>
            <Button primary>Odhlásit se</Button>
          </form>
        </>
      ) : (
        <form action={login}>
          <div className="formField">
            <label>
              Zadejte heslo pro administrátorský přístup:
            </label>
            <input autoFocus type="password" name="password" />
          </div>
          <Button primary>Přihlásit se</Button>
        </form>
      )}
    </Page>
  );
};

export default LoginPage;
