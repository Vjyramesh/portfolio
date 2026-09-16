import type { Meta, StoryObj } from '@storybook/react-vite'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { Sidebar } from './Sidebar'

const meta = {
  title: 'Components/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  decorators: [
    (Story) => {
      const router = createMemoryRouter([{ path: '*', element: <Story /> }], {
        initialEntries: ['/admin/skills'],
      })
      return <RouterProvider router={router} />
    },
  ],
} satisfies Meta<typeof Sidebar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
