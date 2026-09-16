import type { Meta, StoryObj } from '@storybook/react-vite'
import { Input } from './Input'

const meta = {
  title: 'Blocks/Input',
  component: Input,
  tags: ['autodocs'],
  args: { label: 'Name', placeholder: 'Ada Lovelace' },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithError: Story = {
  args: { error: 'This field is required' },
}

export const Disabled: Story = {
  args: { disabled: true },
}
