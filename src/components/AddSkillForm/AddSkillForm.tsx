import { useId, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { gql, type TypedDocumentNode } from '@apollo/client'
import { useMutation } from '@apollo/client/react'
import { useTranslation } from 'react-i18next'
import { Button, Input } from '../../blocks'

export interface AddSkillMutationVars {
  name: string
  category: string
  level: string
  proficiency: number
  yearsOfExperience: number
}

export interface AddSkillMutationData {
  addSkill: AddSkillMutationVars & { id: string }
}

export const ADD_SKILL: TypedDocumentNode<AddSkillMutationData, AddSkillMutationVars> = gql`
  mutation AddSkill(
    $name: String!
    $category: String!
    $level: String!
    $proficiency: Int!
    $yearsOfExperience: Int!
  ) {
    addSkill(
      name: $name
      category: $category
      level: $level
      proficiency: $proficiency
      yearsOfExperience: $yearsOfExperience
    ) {
      id
      name
      category
      level
      proficiency
      yearsOfExperience
    }
  }
`

export function AddSkillForm() {
  const { t } = useTranslation('addSkillForm')
  const [submitted, setSubmitted] = useState(false)

  const schema = useMemo(
    () =>
      z.object({
        name: z.string().trim().min(1, t('errors.required')),
        category: z.string().trim().min(1, t('errors.required')),
        level: z.string().trim().min(1, t('errors.required')),
        proficiency: z.coerce
          .number()
          .int(t('errors.proficiencyRange'))
          .min(1, t('errors.proficiencyRange'))
          .max(100, t('errors.proficiencyRange')),
        yearsOfExperience: z.coerce
          .number()
          .int(t('errors.yearsNonNegative'))
          .min(1, t('errors.yearsNonNegative')),
      }),
    [t],
  )

  type FormInput = z.input<typeof schema>
  type FormOutput = z.output<typeof schema>

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormInput, unknown, FormOutput>({ resolver: zodResolver(schema) })

  const [addSkill, { loading, error: mutationError }] = useMutation(ADD_SKILL)

  const formId = useId()

  const onSubmit = handleSubmit(async (values) => {
    setSubmitted(false)
    try {
      await addSkill({ variables: values })
      reset()
      setSubmitted(true)
    } catch {
      // mutationError from useMutation already reflects the failure
    }
  })

  return (
    <form onSubmit={onSubmit} noValidate aria-labelledby={`${formId}-heading`}>
      <h2 id={`${formId}-heading`}>{t('heading')}</h2>

      <Input
        type="text"
        label={t('labels.name')}
        error={errors.name?.message}
        {...register('name')}
      />

      <Input
        type="text"
        label={t('labels.category')}
        error={errors.category?.message}
        {...register('category')}
      />

      <Input
        type="text"
        label={t('labels.level')}
        error={errors.level?.message}
        {...register('level')}
      />

      <Input
        type="number"
        min={1}
        max={100}
        step={1}
        label={t('labels.proficiency')}
        error={errors.proficiency?.message}
        {...register('proficiency')}
      />

      <Input
        type="number"
        min={1}
        step={1}
        label={t('labels.yearsOfExperience')}
        error={errors.yearsOfExperience?.message}
        {...register('yearsOfExperience')}
      />

      {mutationError && <p role="alert">{t('errors.submissionFailed')}</p>}
      {submitted && !mutationError && <p role="status">{t('success')}</p>}

      <Button type="submit" disabled={isSubmitting || loading}>
        {t('submit')}
      </Button>
    </form>
  )
}
