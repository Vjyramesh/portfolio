import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { MockedProvider } from '@apollo/client/testing/react'
import { AddSkillForm, ADD_SKILL } from './AddSkillForm'

const validVariables = {
  name: 'TypeScript',
  category: 'Languages',
  level: 'Expert',
  proficiency: 90,
  yearsOfExperience: 5,
}

async function fillValidSkill(canvas: ReturnType<typeof within>) {
  await userEvent.type(canvas.getByLabelText(/^name$/i), validVariables.name)
  await userEvent.type(canvas.getByLabelText(/category/i), validVariables.category)
  await userEvent.type(canvas.getByLabelText(/level/i), validVariables.level)
  await userEvent.type(canvas.getByLabelText(/proficiency/i), String(validVariables.proficiency))
  await userEvent.type(
    canvas.getByLabelText(/years of experience/i),
    String(validVariables.yearsOfExperience),
  )
}

const meta = {
  title: 'Components/AddSkillForm',
  component: AddSkillForm,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MockedProvider
        mocks={[
          {
            request: { query: ADD_SKILL, variables: () => true },
            result: (variables) => ({
              data: { addSkill: { id: '1', ...variables } },
            }),
          },
        ]}
      >
        <Story />
      </MockedProvider>
    ),
  ],
} satisfies Meta<typeof AddSkillForm>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const ValidationErrors: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: /add skill/i }))

    expect(await canvas.findAllByRole('alert')).not.toHaveLength(0)
  },
}

export const Submitted: Story = {
  decorators: [
    (Story) => (
      <MockedProvider
        mocks={[
          {
            request: { query: ADD_SKILL, variables: validVariables },
            result: { data: { addSkill: { id: '1', ...validVariables } } },
          },
        ]}
      >
        <Story />
      </MockedProvider>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await fillValidSkill(canvas)
    await userEvent.click(canvas.getByRole('button', { name: /add skill/i }))

    expect(await canvas.findByRole('status')).toHaveTextContent(/added/i)
  },
}

export const SubmissionError: Story = {
  decorators: [
    (Story) => (
      <MockedProvider
        mocks={[
          {
            request: { query: ADD_SKILL, variables: validVariables },
            error: new Error('Server error'),
          },
        ]}
      >
        <Story />
      </MockedProvider>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await fillValidSkill(canvas)
    await userEvent.click(canvas.getByRole('button', { name: /add skill/i }))

    expect(await canvas.findByRole('alert')).toHaveTextContent(/something went wrong/i)
  },
}
