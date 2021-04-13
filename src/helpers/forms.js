import { isEqual } from '@/libs/isEqual';
import { storeCreate } from '@/libs/store';

const ACTION_TYPES = {
  SET_ITEMS: 'SET_ITEMS',
};

/**
 * @typedef {'SET_ITEMS'} FormsActionType
 * */

/**
 * @template {string} FieldName
 * @template {*} FieldValue
 * @template {Record<FieldName, FieldValue>} FieldValues
 * @template {string} ValidatorName
 * @template {function(FieldValue): boolean|Promise<boolean>} Validator
 * @template {Record<ValidatorName, Validator>} Validations
 * @template {{
 *   name: FieldName
 *   value: FieldValue
 *   pending: boolean
 *   invalid: boolean
 *   changed: boolean
 *   dirty: boolean
 *   failed: boolean
 *   validations: Record<ValidatorName, boolean>
 *   onChange: function(FieldValue): void
 * }} FormsField
 *
 * @param {Object} params
 * @param {FieldValues} params.values
 * @param {Record<FieldName, Validations>} params.schema
 *
 * @return {{
 *   set: function(Partial<Object<FieldName, FieldValue>>): void
 *   update: function(Partial<Object<FieldName, FieldValue>>): void
 *   reset: function(): void
 *   validate: function(): void
 *   getValues: function(): Record<FieldName, FieldValue>
 *   getChanged: function(): Partial<Record<FieldName, FieldValue>>
 *   useForm: function(): {
 *     anyPending: boolean
 *     anyInvalid: boolean
 *     anyChanged: boolean
 *     anyDirty: boolean
 *     anyFailed: boolean
 *     fields: Record<FieldName, FormsField>
 *   }
 * }}
 * */
export function formsCreate(params) {
  /** @type {FormsState} */
  const initialState = getData(params.values, params.schema);

  /**
   * @typedef {Object} FormsState
   * @property {Record<string, FormsItem>} items
   * */

  /**
   * @typedef {Object} FormsItem
   * @property {string} name
   * @property {*} value
   * @property {*} initialValue
   * @property {Set<string>} pendingValidations
   * @property {Set<string>} failedValidations
   * @property {boolean} changed
   * @property {boolean} dirty
   * @property {Object<string, FormValidator>} validators
   * @property {Object<string, boolean|Promise<boolean>>} validations
   * */

  /**
   * @typedef {function(*): boolean|Promise<boolean>} FormValidator
   * */

  /**
   * @typedef {Object} FormsData
   * @property {boolean} anyPending
   * @property {boolean} anyInvalid
   * @property {boolean} anyChanged
   * @property {boolean} anyDirty
   * @property {boolean} anyFailed
   * @property {Record<string, FormsField>} fields
   * */

  /**
   * @typedef {Object} FormsField
   * @property {string} name
   * @property {*} value
   * @property {boolean} pending
   * @property {boolean} invalid
   * @property {boolean} changed
   * @property {boolean} dirty
   * @property {boolean} failed
   * @property {Record<string, boolean|Promise<boolean>>} validations
   * @property {function(*): void} onChange
   * */

  const {
    getState,
    dispatch,
    useStore,
  } = storeCreate(initialState, reducer);

  initialValidate();

  /**
   * @typedef {Object} FormsPayload
   * @property {Record<string, FormsItem>} [items]
   * */

  /**
   * @param {FormsState} state
   * @param {{ type: FormsActionType, payload: FormsPayload }} action
   * @return {FormsState}
   * */
  function reducer(state, action) {
    switch (action.type) {
      case ACTION_TYPES.SET_ITEMS:
        return {
          ...state,
          items: action.payload.items,
        };
      default:
        return state;
    }
  }

  /**
   * @typedef {Record<string, *>} FormsValues
   * */

  /**
   * @typedef {Object<string, Record<string, FormValidator>>} FormsSchema
   * */

  /**
   * @param {FormsValues} values
   * @param {FormsSchema} schema
   * @return {FormsState}
   * */
  function getData(values, schema) {
    /** @type {FormsState} */
    const initialData = {
      items: {},
    };

    return Object
      .entries(values)
      .reduce((data, [name, value]) => {
        const item = {
          name,
          value,
          initialValue: value,
          pendingValidations: new Set(),
          failedValidations: new Set(),
          changed: false,
          dirty: false,
          validators: {},
          validations: {},
        };
        if (typeof schema[name] === 'object' && schema[name] !== null) {
          Object
            .entries(schema[name])
            .forEach(([validationName, validator]) => {
              if (typeof validator !== 'function') {
                return;
              }
              item.validators[validationName] = validator;
              item.validations[validationName] = false;
            });
        }
        data.items[name] = item;

        return data;
      }, initialData);
  }

  /**
   * @return {void}
   * */
  function initialValidate() {
    const { items } = getState();
    Object
      .keys(items)
      .forEach((name) => runValidators(name));
  }

  /**
   * @param {string} name
   * @param {*} value
   * @param {string} validationName
   * @param {FormValidator} validator
   * @return {Promise<boolean>}
   * */
  async function execValidation(name, value, validationName, validator) {
    try {
      let invalid = validator(value);
      if (invalid instanceof Promise) {
        updateItemValidationPending(name, validationName, true);
        invalid = await invalid;
        updateItemValidationPending(name, validationName, false);
      }
      updateItemValidation(name, validationName, invalid);
    }
    catch (err) {
      updateItemValidation(name, validationName, true);
    }
  }

  /**
   * @param {string} name
   * @return {void}
   * */
  function runValidators(name) {
    const { items } = getState();
    const item = items[name];
    if (typeof item === 'undefined') {
      return;
    }
    Object
      .entries(item.validators)
      .forEach(([validationName, validator]) => {
        execValidation(item.name, item.value, validationName, validator)
          .then()
          .catch();
      });
  }

  /**
   * @param {string} name
   * @param {function(FormsItem): FormsItem} updater
   * @return {void}
   * */
  function updateItem(name, updater) {
    const { items } = getState();
    const item = items[name];
    if (typeof item === 'undefined' || typeof updater !== 'function') {
      return;
    }
    const nextItem = updater(item);
    const nextItems = {
      ...items,
      [name]: nextItem,
    };
    dispatch(ACTION_TYPES.SET_ITEMS, {
      items: nextItems,
    });
  }

  /**
   * @param {string} name
   * @param {string} validationName
   * @param {boolean} pending
   * @return {void}
   * */
  function updateItemValidationPending(name, validationName, pending) {
    updateItem(name, (prevItem) => {
      const prevPendingValidations = prevItem.pendingValidations;
      const nextPendingValidations = new Set(prevPendingValidations);
      if (pending) {
        nextPendingValidations.add(validationName);
      }
      else {
        nextPendingValidations.delete(validationName);
      }
      return {
        ...prevItem,
        pendingValidations: nextPendingValidations,
      };
    });
  }

  /**
   * @param {string} name
   * @param {string} validationName
   * @param {boolean} invalid
   * @return {void}
   * */
  function updateItemValidation(name, validationName, invalid) {
    updateItem(name, (prevItem) => {
      const prevFailedValidations = prevItem.failedValidations;
      const nextFailedValidations = new Set(prevFailedValidations);
      if (invalid) {
        nextFailedValidations.add(validationName);
      }
      else {
        nextFailedValidations.delete(validationName);
      }
      return {
        ...prevItem,
        failedValidations: nextFailedValidations,
        invalid: nextFailedValidations.size > 0,
        validations: {
          ...prevItem.validations,
          [validationName]: invalid,
        },
      };
    });
  }

  /**
   * @param {FormsState} state
   * @return {FormsData}
   * */
  function getForm(state) {
    /** @type {FormsData} */
    const initialFormData = {
      anyPending: false,
      anyInvalid: false,
      anyChanged: false,
      anyDirty: false,
      anyFailed: false,
      fields: {},
    };

    return Object
      .values(state.items)
      .reduce((formData, item) => {
        const pendingValidations = item.pendingValidations;
        const failedValidations = item.failedValidations;
        const pending = pendingValidations.size > 0;
        const invalid = failedValidations.size > 0;
        const changed = item.changed;
        const dirty = item.dirty;
        const failed = invalid && dirty;
        /** @type {FormsField} */
        const field = {
          name: item.name,
          value: item.value,
          pending,
          invalid,
          changed,
          dirty,
          failed,
          validations: item.validations,
          onChange: (nextValue) => update({
            [item.name]: nextValue,
          }),
        };
        if (pending) {
          formData.anyPending = true;
        }
        if (invalid) {
          formData.anyInvalid = true;
        }
        if (changed) {
          formData.anyChanged = true;
        }
        if (dirty) {
          formData.anyDirty = true;
        }
        if (failed) {
          formData.anyFailed = true;
        }
        formData.fields[field.name] = field;

        return formData;
      }, initialFormData);
  }

  /**
   * @param {Record<string, *>} values
   * @return {void}
   * */
  function set(values) {
    Object
      .entries(values)
      .forEach(([name, nextValue]) => {
        updateItem(name, (prevItem) => {
          return {
            ...prevItem,
            value: nextValue,
            initialValue: nextValue,
            changed: false,
            dirty: false,
          };
        });
        runValidators(name);
      });
  }

  /**
   * @param {Record<string, *>} values
   * @return {void}
   * */
  function update(values) {
    Object
      .entries(values)
      .forEach(([name, nextValue]) => {
        updateItem(name, (prevItem) => {
          return {
            ...prevItem,
            value: nextValue,
            changed: !isEqual(prevItem.initialValue, nextValue),
            dirty: true,
          };
        });
        runValidators(name);
      });
  }

  /**
   * @return {void}
   * */
  function reset() {
    const { items } = getState();
    Object
      .keys(items)
      .forEach((name) => {
        updateItem(name, (prevItem) => {
          return {
            ...prevItem,
            initialValue: prevItem.value,
            changed: false,
            dirty: false,
          };
        });
      });
  }

  /**
   * @return {void}
   * */
  function validate() {
    const { items } = getState();
    Object
      .keys(items)
      .forEach((name) => {
        updateItem(name, (prevItem) => {
          return {
            ...prevItem,
            dirty: true,
          };
        });
        runValidators(name);
      });
  }

  /**
   * @return {Record<string, *>}
   * */
  function getValues() {
    const { items } = getState();
    return Object
      .values(items)
      .reduce((result, item) => {
        result[item.name] = item.value;
        return result;
      }, {});
  }

  /**
   * @return {Record<string, *>}
   * */
  function getChanged() {
    const { items } = getState();
    return Object
      .values(items)
      .reduce((changed, item) => {
        if (item.changed) {
          changed[item.name] = item.value;
        }
        return changed;
      }, {});
  }

  function useForm() {
    const state = getState();

    useStore();

    return getForm(state);
  }

  return {
    set,
    update,
    reset,
    validate,
    getValues,
    getChanged,
    useForm,
  };
}
