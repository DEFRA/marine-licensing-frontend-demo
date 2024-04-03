import { renderTemplate } from '~/test-helpers/component-helpers'

describe('partials/application', () => {
  const application = {
    title: 'Fake Application',
    background: 'Fake application background',
    applicant: {
      firstName: 'Joe',
      lastName: 'Bloggs',
      email: 'joe.bloggs@domain.com',
      address: '1 Somewhere Street, Somewhere, AB1 2CD'
    },
    site: {
      coordinates: '[1, 1]'
    }
  }

  describe('rendering an application', () => {
    test('should render template correctly using the application details', () => {
      const template = renderTemplate('partials/application.njk', {
        application
      }).root()

      expect(template.find('[name="title"]').val()).toEqual(application.title)
      expect(template.find('[name="background"]').text()).toEqual(
        application.background
      )
      expect(template.find('[name="firstName"]').val()).toEqual(
        application.applicant.firstName
      )
      expect(template.find('[name="lastName"]').val()).toEqual(
        application.applicant.lastName
      )
      expect(template.find('[name="email"]').val()).toEqual(
        application.applicant.email
      )
      expect(template.find('[name="address"]').val()).toEqual(
        application.applicant.address
      )
      expect(template.find('[name="site"]').val()).toEqual(
        application.site.coordinates
      )
    })
  })

  describe('rendering an amendment', () => {
    const amendment = {
      applicant: {
        firstName: {
          originalValue: application.applicant.firstName,
          comment: 'This looks like a fake name'
        }
      },
      site: {
        coordinates: {
          originalValue: application.site.coordinates,
          comment: 'These look like fake coordinates'
        }
      }
    }

    test('should render template with the correct header', () => {
      const template = renderTemplate('partials/application.njk', {
        application,
        amendment
      }).root()

      expect(template.find('.govuk-error-summary')).not.toBeNull()
    })

    test('should render template correctly using the amendment details', () => {
      const template = renderTemplate('partials/application.njk', {
        application,
        amendment
      }).root()

      const applicantParent = template.find('[name="firstName"]').parent()
      expect(applicantParent.find('.govuk-input--error')).not.toBeNull()
      expect(applicantParent.find('.govuk-error-message').text()).toContain(
        amendment.applicant.firstName.comment
      )

      const siteParent = template.find('[name="site"]').parent()
      expect(siteParent.find('.govuk-input--error')).not.toBeNull()
      expect(siteParent.find('.govuk-error-message').text()).toContain(
        amendment.site.coordinates.comment
      )
    })
  })
})
