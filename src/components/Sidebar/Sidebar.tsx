import { NavLink } from 'react-router'
import { useTranslation } from 'react-i18next'
import './Sidebar.css'

const links = [
  { key: 'basicInfo', path: '/admin/basic-info' },
  { key: 'experience', path: '/admin/experience' },
  { key: 'works', path: '/admin/works' },
  { key: 'skills', path: '/admin/skills' },
  { key: 'blogs', path: '/admin/blogs' },
  { key: 'caseStudies', path: '/admin/case-studies' },
  { key: 'whitePapers', path: '/admin/white-papers' },
  { key: 'certifications', path: '/admin/certifications' },
  { key: 'education', path: '/admin/education' },
  { key: 'contact', path: '/admin/contact' },
] as const

export function Sidebar() {
  const { t } = useTranslation('sidebar')

  return (
    <nav aria-label={t('navLabel')} className="sidebar">
      <ul className="sidebar-list">
        {links.map(({ key, path }) => (
          <li key={key}>
            <NavLink
              to={path}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
              }
            >
              {t(`links.${key}`)}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
