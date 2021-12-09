import 'bootstrap/dist/css/bootstrap.css'
import buildClient from '../api/build-client';
import BaseLayout from '../cmps/BaseLayout';
const AppComponent = ({Component,pageProps,currentUser}) => {
  return (
    <BaseLayout currentUser={currentUser}>
    <Component {...pageProps} currentUser={currentUser} />
</BaseLayout>
  )
}
AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx)
  const { data } = await client.get('/api/users/currentuser');
  let pageProps ={}
  if(appContext.Component.getInitialProps){
    pageProps = await appContext.Component.getInitialProps(appContext.ctx,client,data.currentUser)
  }
  return { pageProps,...data };
};


export default AppComponent
