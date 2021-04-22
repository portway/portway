import { ActionTypes } from '../actions'
import { STATUS_TYPES } from 'Shared/constants'

const initialState = {
  confirmation: {
    confirming: false,
    message: '',
    options: {
      cancelAction: null,
      confirmedAction: null,
      confirmedLabel: '',
      confirmedText: null,
      theme: null,
    },
  },
  document: {
    isFullScreen: false,
  },
  documents: {
    createMode: false, // we are in create mode
    isCreating: false, // we are actually creating the document, progress
    isPublishing: false,
    isSearching: false,
  },
  fields: {
    withOpenSettings: {},
    currentFieldForFormatting: null,
    disabled: false,
    fieldsUpdating: {},
    type: -1
  },
  tokens: {
    creating: false
  },
  users: {
    creating: false,
    inviting: false
  },
  billing: {
    isSubmitting: false,
    isStripeOpen: false
  },
  spinner: {
    spinning: false
  },
  status: {
    label: null,
    type: null,
    visible: false,
  }
}

export const ui = (state = initialState, action) => {
  switch (action.type) {
    // If you need to update spinner in combo with something else, do it below
    // these two global on/offs
    // Global Spinner state on
    case ActionTypes.INITIATE_USER_CREATE:
    case ActionTypes.INITIATE_USER_REMOVE: {
      return {
        ...state,
        spinner: {
          ...state.spinner,
          spinning: true
        }
      }
    }

    // Global Spinner state off
    case ActionTypes.RECEIVE_CREATED_USER:
    case ActionTypes.REMOVE_USER:
    case ActionTypes.RECEIVE_UPDATED_USER_ROLE: {
      return {
        ...state,
        users: {
          ...state.users,
          creating: false
        },
        spinner: {
          ...state.spinner,
          spinning: false
        }
      }
    }

    // Document and field creation
    // -------------------------------------------------------------------------
    case ActionTypes.UI_DOCUMENT_CREATE: {
      return { ...state, documents: { ...state.documents, creating: action.value } }
    }
    case ActionTypes.INITIATE_DOCUMENT_CREATE: {
      return { ...state, documents: { ...state.documents, isCreating: true } }
    }
    case ActionTypes.INITIATE_FIELD_CREATE: {
      // Tell everyone we're creating a field, and what type
      return { ...state, fields: { ...state.fields, disabled: true, type: action.fieldType } }
    }
    case ActionTypes.RECEIVE_CREATED_FIELD: {
      // Reset fields when a field is created
      return { ...state, fields: initialState.fields }
    }
    case ActionTypes.RECEIVE_CREATED_DOCUMENT: {
      return {
        ...state,
        documents: {
          ...state.documents,
          creating: false,
          isCreating: false
        },
        status: {
          label: null,
          type: null,
          visible: false,
        }
      }
    }
    case ActionTypes.INITIATE_FIELD_UPDATE: {
      const fieldsUpdating = { ...state.fields.fieldsUpdating, [action.fieldId]: true }
      return { ...state, fields: { ...state.fields, fieldsUpdating } }
    }
    case ActionTypes.RECEIVE_UPDATED_FIELD: {
      const { fieldId } = action
      const fieldsUpdating = { ...state.fields.fieldsUpdating, [fieldId]: false }
      return { ...state, fields: { ...state.fields, fieldsUpdating } }
    }
    case ActionTypes.INITIATE_DOCUMENT_DUPLICATION: {
      return {
        ...state,
        status: {
          label: 'Duplicating document...',
          type: STATUS_TYPES.DUPLICATING_DOCUMENT,
          visible: true
        }
      }
    }

    // Document search list
    case ActionTypes.INITIATE_DOCUMENT_SEARCH: {
      return {
        ...state,
        documents: {
          ...state.documents,
          isSearching: true
        }
      }
    }
    case ActionTypes.SEARCH_CLEAR: {
      return {
        ...state,
        documents: {
          ...state.documents,
          isSearching: false
        }
      }
    }

    // Disable document fields
    case ActionTypes.INITIATE_FIELD_MOVE:
    case ActionTypes.INITIATE_FIELD_COPY: {
      return {
        ...state,
        fields: {
          ...state.fields,
          disabled: true
        }
      }
    }

    // Focused field for formatting
    case ActionTypes.FOCUS_FIELD: {
      const { fieldId, fieldData, fieldType } = action
      const currentFieldForFormatting = { ...state.fields.currentFieldForFormatting }
      currentFieldForFormatting.id = fieldId
      currentFieldForFormatting.type = fieldType
      currentFieldForFormatting.data = fieldData
      return {
        ...state,
        fields: {
          ...state.fields,
          currentFieldForFormatting
        }
      }
    }

    // Enable document fields
    case ActionTypes.FIELD_MOVED:
    case ActionTypes.FIELD_COPIED: {
      return {
        ...state,
        fields: {
          ...state.fields,
          disabled: false
        }
      }
    }

    // Field Settings
    case ActionTypes.UI_TOGGLE_FIELD_SETTINGS: {
      const withOpenSettings = {
        ...state.fields.withOpenSettings,
        [action.fieldId]: !state.fields.withOpenSettings[action.fieldId]
      }
      return {
        ...state,
        fields: {
          ...state.fields,
          withOpenSettings
        }
      }
    }

    // Document full screen
    // -------------------------------------------------------------------------
    case ActionTypes.UI_DOCUMENT_FULL_SCREEN: {
      return {
        ...state,
        document: {
          ...state.document,
          isFullScreen: action.value
        }
      }
    }

    // Document publishng
    // -------------------------------------------------------------------------
    case ActionTypes.INITIATE_DOCUMENT_PUBLISH:
    case ActionTypes.INITIATE_DOCUMENT_UNPUBLISH: {
      return {
        ...state,
        documents: {
          ...state.documents,
          isPublishing: true
        },
        spinner: {
          spinning: true
        }
      }
    }
    case ActionTypes.RECEIVE_PUBLISHED_DOCUMENT:
    case ActionTypes.RECEIVE_UNPUBLISHED_DOCUMENT: {
      return {
        ...state,
        documents: {
          ...state.documents,
          isPublishing: false
        },
        spinner: {
          spinning: false
        }
      }
    }

    // Confirmation dialog
    // -------------------------------------------------------------------------
    case ActionTypes.UI_INITIATE_CONFIRMATION: {
      return {
        ...state,
        confirmation: {
          ...state.confirmation,
          confirming: true,
          message: action.message,
          options: {
            ...state.confirmation.options,
            ...action.options
          }
        }
      }
    }
    case ActionTypes.UI_COMPLETE_CONFIRMATION: {
      const confirmation = initialState.confirmation
      return {
        ...state,
        confirmation
      }
    }
    case ActionTypes.UI_CANCEL_CONFIRMATION: {
      const confirmation = initialState.confirmation
      return {
        ...state,
        confirmation
      }
    }

    // Users
    // -------------------------------------------------------------------------
    case ActionTypes.UI_CREATE_USER_MODE: {
      return {
        ...state,
        users: {
          ...state.users,
          creating: action.value
        }
      }
    }

    // Reinviting user
    case ActionTypes.INITIATE_USER_REINVITE: {
      return {
        ...state,
        users: {
          ...state.users,
          inviting: true
        },
        spinner: {
          ...state.spinner,
          spinning: true
        }
      }
    }

    case ActionTypes.RECEIVE_REINVITED_USER: {
      return {
        ...state,
        users: {
          ...state.users,
          inviting: false
        },
        spinner: {
          ...state.spinner,
          spinning: false
        }
      }
    }

    // Project tokens
    // -------------------------------------------------------------------------
    case ActionTypes.UI_CREATE_TOKEN_MODE: {
      return {
        ...state,
        tokens: {
          ...state.tokens,
          creating: action.value
        }
      }
    }
    case ActionTypes.RECEIVE_CREATED_PROJECT_TOKEN: {
      return {
        ...state,
        tokens: {
          ...state.tokens,
          creating: false
        }
      }
    }

    // Billing / Stripe form
    // -------------------------------------------------------------------------
    // Disable the form for submission once submitting the form
    case ActionTypes.INITIATE_ORGANIZATION_BILLING_UPDATE: {
      return {
        ...state,
        billing: {
          ...state.billing,
          isSubmitting: true
        }
      }
    }
    // Close the Stripe form when we receive a successful round trip
    case ActionTypes.RECEIVE_UPDATED_ORGANIZATION_BILLING: {
      return {
        ...state,
        billing: {
          ...state.billing,
          isSubmitting: false,
          isStripeOpen: false
        }
      }
    }
    // A validation / 402 happened with Stripe
    case ActionTypes.RECEIVE_BILLING_ERROR: {
      return {
        ...state,
        billing: {
          ...state.billing,
          isSubmitting: false
        }
      }
    }

    default:
      return { ...state }
  }
}
