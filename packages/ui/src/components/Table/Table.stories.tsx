import type { Meta, StoryObj } from '@storybook/react-vite';
import { Table } from './Table';

const meta: Meta<typeof Table> = {
  title: 'Data/Table',
  component: Table,
  tags: ['autodocs'],
  argTypes: {
    children: { description: 'Table sections and rows, such as `<thead>` and `<tbody>`.' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Native table inside a named keyboard-focusable scroll region. Supply semantic thead/tbody/th/td children; caption is required. Ref targets the table. Table subparts are ordinary HTML.',
      },
    },
  },
  args: {
    caption: 'Employees',
    children: (
      <>
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Department</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Alex Morgan</th>
            <td>Engineering</td>
          </tr>
        </tbody>
      </>
    ),
  },
};
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Dark: Story = { parameters: { theme: 'dark' } };
export const Narrow: Story = {
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 280 }}>
        <Story />
      </div>
    ),
  ],
};
