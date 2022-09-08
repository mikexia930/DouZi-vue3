/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  prefix: 'tw-',
  theme: {
    extend: {
      minWidth: {}
    },
    colors: {
      black: '#000000',
      white: '#FFFFFF',
      neutral: {
        0: 'var(--neutral-0)',
        1: 'var(--neutral-1)',
        2: 'var(--neutral-2)',
        3: 'var(--neutral-3)',
        4: 'var(--neutral-4)',
        5: 'var(--neutral-5)',
        6: 'var(--neutral-6)',
        7: 'var(--neutral-7)',
        8: 'var(--neutral-8)',
        9: 'var(--neutral-9)'
      },
      primary: {
        0: 'var(--primary-0)',
        1: 'var(--primary-1)',
        2: 'var(--primary-2)',
        3: 'var(--primary-3)',
        4: 'var(--primary-4)',
        5: 'var(--primary-5)',
        6: 'var(--primary-6)',
        7: 'var(--primary-7)'
      },
      success: {
        0: 'var(--success-0)',
        1: 'var(--success-1)',
        2: 'var(--success-2)',
        3: 'var(--success-3)',
        4: 'var(--success-4)',
        5: 'var(--success-5)',
        6: 'var(--success-6)',
        7: 'var(--success-7)'
      },
      warning: {
        0: 'var(--warning-0)',
        1: 'var(--warning-1)',
        2: 'var(--warning-2)',
        3: 'var(--warning-3)',
        4: 'var(--warning-4)',
        5: 'var(--warning-5)',
        6: 'var(--warning-6)',
        7: 'var(--warning-7)'
      },
      danger: {
        0: 'var(--danger-0)',
        1: 'var(--danger-1)',
        2: 'var(--danger-2)',
        3: 'var(--danger-3)',
        4: 'var(--danger-4)',
        5: 'var(--danger-5)',
        6: 'var(--danger-6)',
        7: 'var(--danger-7)'
      },
      'no-emotion': {
        0: 'var(--no-emotion-0)',
        1: 'var(--no-emotion-1)',
        2: 'var(--no-emotion-2)',
        3: 'var(--no-emotion-3)',
        4: 'var(--no-emotion-4)',
        5: 'var(--no-emotion-5)',
        6: 'var(--no-emotion-6)',
        7: 'var(--no-emotion-7)'
      },
      standard: {
        1: 'var(--standard-1)',
        2: 'var(--standard-2)',
        3: 'var(--standard-3)',
        4: 'var(--standard-4)',
        5: 'var(--standard-5)',
        6: 'var(--standard-6)',
        7: 'var(--standard-7)',
        8: 'var(--standard-8)',
        9: 'var(--standard-9)',
        10: 'var(--standard-10)',
        11: 'var(--standard-11)',
        12: 'var(--standard-12)',
        13: 'var(--standard-13)',
        14: 'var(--standard-14)',
        15: 'var(--standard-15)'
      },
      link: {
        normal: 'var(--link-normal)',
        hover: 'var(--link-hover)'
      }
    },
    fontSize: {
      sm: ['12px', '18px'],
      base: ['14px', '22px'],
      lg: ['16px', '24px'],
      xl: ['18px', '26px'],
      '2xl': ['20px', '28px'],
      '3xl': ['24px', '32px'],
      '4xl': ['30px', '38px']
    }
  },
  plugins: [],
}
