
import { OmitUndefined } from 'class-variance-authority/types'


export type VariantProps<Component extends (...args: any) => any> = Omit<OmitUndefined<Parameters<Component>[0]>, "class" | "className">;

const SectionHeader = ({subjectHeader, titleHeader, className}: any ) => {
  return (
    <div className={`mb-5 flex flex-col ${className}`}>
        <h3 className='text-md text-[#F9844A] font-semibold'>{subjectHeader}</h3>
        <h2 className='text-3xl font-bold'>{titleHeader}</h2>
    </div>
  )
}

export default SectionHeader