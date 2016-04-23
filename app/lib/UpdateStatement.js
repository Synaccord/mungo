import MungoError from './Error';

class MungoUpdateStatementError extends MungoError {}

class UpdateStatement {

  static operators = [
    '$unset',
    '$push',
    '$inc',
    '$incr',
    '$increment',
    '$mul',
    '$rename'
  ];

  /** new UpdateStatement
   *  @arg object document
   *  @arg function model
   **/

  constructor (document, model) {
    try {
      if (document.constructor !== Object) {
        throw new MungoUpdateStatementError(
          'new UpdateStatement(document) > document must be an object',
          {document, model: model.name}
        );
      }
      if (typeof model !== 'function') {
        throw new MungoUpdateStatementError(
          'new UpdateStatement(model) > model must be a class',
          {document, model}
        );
      }
      const parsed = this.parseAll(document, model.getSchema());
      for (let field in parsed) {
        this[field] = parsed[field];
      }
    } catch (error) {
      throw MungoUpdateStatementError.rethrow(
        error,
        'Could not parse document',
        {document, modelName: model.name}
      );
    }
  }

  parseAll (document, structure) {
    const parsed = {};
    for (let field in document) {
      if (UpdateStatement.operators.indexOf(field) > -1) {
        // Aliases
        let operator = field;
        if (field === '$incr' || field === '$increment') {
          operator = '$inc';
        }
        switch (operator) {
        case '$inc':
        case '$mul':
          parsed[operator] = document[field];
          for (let _field in parsed[field]) {
            parsed[operator][_field] = this.parseField(
              _field, parsed[operator][_field], structure[_field]
            );
          }
          break;
        case '$rename' :
          parsed[operator] = document[field];
          break;
        case '$push' :
          parsed[operator] = {};
          for (let _field in document[field]) {
            parsed[operator][_field] = this.parseField(
              _field,
              [
                document[field][_field],
              ],
              structure[_field]
            )[0];
          }
          break;
        case '$unset' :
          if (Array.isArray(document[field])) {
            parsed.$unset = document[field].reduce(
              (unset, _field) => {
                unset[_field] = '';
                return unset;
              },
              {}
            );
          } else if (typeof document[field] === 'string') {
            parsed.$unset = {[document[field]]: ''};
          } else {
            parsed.$unset = document[field];
          }
          break;
        }
      } else {
        if (!('$set' in parsed)) {
          parsed.$set = {};
        }
        let parsedField;
        try {
          parsedField = this.parseField(
            field,
            document[field],
            structure[field]
          );
          Object.assign(parsed.$set, {[field]: parsedField});
        } catch (error) {
          throw new MungoUpdateStatementError(
            'new UpdateStatement(model) > Could not parse field',
            {
              field,
              document: document[field],
              structure: structure[field],
            }
          );
        }
      }
    }
    return parsed;
  }

  parseField(fieldName, fieldValue, fieldStructure) {
    try {
      return fieldStructure.type.convert(fieldValue);
    } catch (error) {
      throw MungoUpdateStatementError.rethrow(
        error,
        'Could not parse field',
        {
          name: fieldName,
          value: fieldValue,
          field: fieldStructure,
        }
      );
    }
  }
}

export default UpdateStatement;
