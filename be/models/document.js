'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Document extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });

      // Define association to Parent Document (Folder)
      this.belongsTo(models.Document, {
        foreignKey: 'parent_id',
        as: 'parent',
        constraints: false // Allow null values for parent_id
      });

      // Define association to Children Documents
      this.hasMany(models.Document, {
        foreignKey: 'parent_id',
        as: 'children'
      });
    }
  }
  Document.init({
    name: DataTypes.STRING,
    type: DataTypes.ENUM(["folder", "file"]),
    user_id: DataTypes.BIGINT,
    parent_id: DataTypes.BIGINT,
    url: DataTypes.STRING,
    opened_at: DataTypes.DATE,
    deleted_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Document',
    tableName: 'documents',
    underscored: true
  });
  return Document;
};
