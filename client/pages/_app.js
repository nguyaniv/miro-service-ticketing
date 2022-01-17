import buildClient from '../api/build-client';
import BaseLayout from '../cmps/BaseLayout';
import Navbar from '../cmps/Navbar/Navbar';
import styles from '../styles/global.css';
const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <>
      <Navbar currentUser={currentUser} />

      <BaseLayout>
        <Component currentUser={currentUser} {...pageProps} />
      </BaseLayout>
    </>
  );
};
AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/currentuser');
  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      client,
      data.currentUser
    );
  }
  return { pageProps, ...data };
};

export default AppComponent;
