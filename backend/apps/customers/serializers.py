# ─── customers/serializers.py ─────────────────
from rest_framework import serializers

from .models import Customer, Vehicle


class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = [
            "id",
            "license_plate",
            "brand",
            "model",
            "year",
            "color",
            "vin",
            "insurance_company",
            "insurance_policy",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class CustomerSerializer(serializers.ModelSerializer):
    vehicles = VehicleSerializer(many=True, read_only=True)

    class Meta:
        model = Customer
        fields = [
            "id",
            "first_name",
            "last_name",
            "full_name",
            "email",
            "phone",
            "dni",
            "address",
            "city",
            "vehicles",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class CustomerCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = [
            "id",
            "first_name",
            "last_name",
            "email",
            "phone",
            "dni",
            "address",
            "city",
        ]
