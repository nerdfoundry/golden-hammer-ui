import { createStyles } from '@mantine/core';

export interface StyledEventViewerProps {
  colorBG: string;
  colorFG: string;
  colorUserName: string;
  colorBorder: ColorBorder;
}

export interface ColorBorder {
  normal: string;
  inner: Inner;
}

export interface Inner {
  action: string;
  monetized: string;
}

// !FIXME - Need to utilize colors for actual theming!!!

export const StyledEventViewer = createStyles((theme, colors: StyledEventViewerProps) => {
  return {
    Reminder: {
      top: '50%',
      alignSelf: 'center',
      transform: 'translate(0, -50%)',
      position: 'absolute'
    },

    PanelHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: '10px',
      background: theme.fn.darken(theme.colors[theme.primaryColor][9], 0.2),

      a: {
        color: '#FF0',
        fontWeight: 'normal'
      },

      '& > .mantine-Group-root': {
        width: '100%',
        flex: 1
      },

      '.options': {
        justifyContent: 'right',
        flex: 1
      },

      '.statsThumb': {
        position: 'relative',
        width: '100%',
        border: '1px solid #AAA',
        top: '-8px',

        '&:before': {
          content: '"\\23F7"',
          position: 'absolute',
          width: '40px',
          borderBottom: '#EEE',
          top: '-6px',
          textAlign: 'center',
          border: '2px solid #333',
          lineHeight: '18px',
          background: '#ccc',
          color: '#333',
          left: '50%',
          transform: 'translate(-50%)'
        },

        '.stats-container': {
          padding: '3px',
          fontSize: '70%',

          '.label': {
            fontWeight: 'bold',
            fontSize: '110%'
          },

          '& > div': {
            display: 'flex',
            justifyContent: 'space-between',
            paddingLeft: '8px',
            paddingRight: '8px'
          }
        }
      }
    },

    PanelScrollContainer: {
      height: '100%'
    },

    EventLogEntry: {
      position: 'relative',
      fontSize: '18px',
      verticalAlign: 'middle',
      padding: '5px',
      marginBottom: '6px',
      paddingRight: '20px',
      maxHeight: '500px',
      transition: 'all 1s',
      overflow: 'hidden',

      border: '1px solid #29075c',
      borderLeft: '10px solid #29075c',
      backgroundColor: '#0f0816',

      a: {
        color: '#3baac3',
        textDecoration: 'none',

        '&:hover': {
          color: '#bbc349',
          textDecoration: 'underline'
        }
      },

      'img.emote': {
        width: '24px'
      },

      '.userName': {
        color: '#ca7ff9'
      },

      '.removed-content': {
        transition: 'all 250ms',
        filter: 'blur(5px)',
        fontSize: '10px',

        '&:hover': {
          filter: 'blur(0)',
          fontSize: '110%'
        }
      }
    },

    'UserChat-Message': {
      transition: 'all 250ms',

      '&:hover': {
        fontSize: '125%',

        '.removed-content': {
          filter: 'blur(0)',
          fontSize: '110%'
        }
      }
    },

    'UserChat-Presence': {
      fontSize: '10px',
      borderLeft: '4px solid #29075c',
      filter: 'opacity(0.5)',
      transition: 'all 250ms',

      '&:hover': {
        filter: 'opacity(1)',
        fontSize: '18px'
      }
    },

    Administration: {
      fontSize: '10px',

      '.duration': {
        fontSize: '110%',
        textShadow: '0 0 8px rgb(155, 40, 40), 0 0 8px rgb(155, 40, 40)'
      },

      '&:before': {
        content: "' '",
        border: '1px solid rgb(155, 40, 40)',
        boxShadow: 'inset 0 0 26px rgb(155, 40, 40 / 40%)',
        position: 'absolute',
        top: '0',
        bottom: '0',
        left: '0',
        right: '0'
      }
    },

    Monetization: {
      textAlign: 'center',

      '.duration': {
        fontSize: '120%',
        color: '#00d0ff',
        textShadow: '0 0 6px #00d0ff'
      },

      '.estimatedValue': {
        fontSize: '110%',
        textShadow: '0 0 8px #00ff2f, 0 0 8px #00ff2f'
      },

      '&:before': {
        content: "' '",
        border: '1px solid rgb(255, 208, 0)',
        boxShadow: 'inset 0 0 26px rgb(255 208 0 / 40%)',
        position: 'absolute',
        top: '0',
        bottom: '0',
        left: '0',
        right: '0'
      }
    }
  };
});
