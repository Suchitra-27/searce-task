from rest_framework import serializers
from .models import User, Role, Project, Department, Position
from django.contrib.auth.hashers import make_password

# Role Serializer
class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ['id', 'name']

# Department Serializer
class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id', 'name']

# User Serializer
class UserSerializer(serializers.ModelSerializer):
    # role = RoleSerializer()
    # department = DepartmentSerializer()

    class Meta:
        model = User
        fields = ['id', 'email', 'password', 'name', 'role_id', 'department_id', 'created_at', 'updated_at']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # role_data = validated_data.pop('role')
        # department_data = validated_data.pop('department', None)
        # role = Role.objects.get(name=role_data['name'])
        # department = Department.objects.get(name=department_data['name']) if department_data else None        
        # user = User.objects.create(role=role, department=department, **validated_data)
        validated_data['password'] = make_password(validated_data['password'])
        user = User.objects.create(**validated_data)
        return user

# Project Serializer
class ProjectSerializer(serializers.ModelSerializer):
    position_count = serializers.IntegerField(read_only=True)
    class Meta:
        model = Project
        fields = ['id', 'name', 'project_description', 'project_budget','co_planner', 'created_at', 'updated_at', 'created_by_id', 'updated_by_id', 'position_count']
        extra_kwargs = {
            'password': {'write_only': True},  # Ensure the password is write-only
            'created_at': {'read_only': True},
            'updated_at': {'read_only': True},
            'created_by_id': {'read_only': True},
            'updated_by_id': {'read_only': True},
        }

    def create(self, validated_data):
        # Automatically set the 'created_by_id' and 'updated_by_id' fields to the current user
        user = self.context['request'].user  # Access the current user from the request context
        validated_data['created_by_id'] = user.id
        validated_data['updated_by_id'] = user.id
        return super().create(validated_data)

    def update(self, instance, validated_data):
        # Automatically set the 'updated_by_id' field to the current user during updates
        user = self.context['request'].user  # Access the current user from the request context
        validated_data['updated_by_id'] = user.id
        return super().update(instance, validated_data)

# Position Serializer
class PositionSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department_id.name', read_only=True)
    updated_by_name = serializers.CharField(source='updated_by.name', read_only=True)
    class Meta:
        model = Position
        fields = ['id', 'project_id', 'designation', 'department_id', 'budget', 'location', 'updated_by', 'created_at', 'updated_at','department_name', 'updated_by_name']
        extra_kwargs = {
            'created_at': {'read_only': True},
            'updated_at': {'read_only': True},
            'updated_by': {'read_only': True},
        }
        
    def create(self, validated_data):
        # Automatically set the 'updated_by' field to the current user during creation
        user = self.context['request'].user  # Access the current user from the request context
        validated_data['updated_by'] = user
        return super().create(validated_data)

    def update(self, instance, validated_data):
        # Automatically set the 'updated_by' field to the current user during update
        user = self.context['request'].user  # Access the current user from the request context
        validated_data['updated_by'] = user
        return super().update(instance, validated_data)
