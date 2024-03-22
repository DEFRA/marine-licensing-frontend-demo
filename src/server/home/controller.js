import { config } from '~/src/config'

const homeController = {
  handler: (request, h) => {
    return h.view('home/index', {
      pageTitle: 'Home',
      heading: 'Home',
      applicationUrl: `${config.get('appPathPrefix')}/apply`,
      breadcrumbs: [
        {
          text: 'Home',
          href: '/'
        }
      ]
    })
  }
}

export { homeController }
