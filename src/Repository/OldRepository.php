<?php

namespace App\Repository;

use Doctrine\DBAL\Connection;
use Doctrine\DBAL\Exception;

class OldRepository
{
    /**
     * @var Connection The database connection
     */
    private $connection;

    /**
     * The constructor.
     *
     * @param Connection $connection The database connection
     */
    public function __construct(Connection $connection)
    {
        $this->connection = $connection;
    }

    /**
     * @throws \Doctrine\DBAL\Driver\Exception
     * @throws Exception
     */
    public function findAllProperties(): array
    {
        $query = $this->connection->createQueryBuilder();

        return $query
            ->select('*')
            ->from('properties')
            ->execute()
            ->fetchAllAssociative()
        ;
    }

    /**
     * @throws Exception
     */
    public function findOneByUidProperty($uid)
    {
        $query = $this->connection->createQueryBuilder();

        return $query
            ->select('*')
            ->from('properties')
            ->where('uid = :uid')
            ->setParameter('uid', $uid)
            ->execute()
            ->fetch()
            ;
    }

    /**
     * @throws \Doctrine\DBAL\Driver\Exception
     * @throws Exception
     */
    public function findAllInventories(): array
    {
        $query = $this->connection->createQueryBuilder();

        return $query
            ->select('*')
            ->from('inventories')
            ->execute()
            ->fetchAllAssociative()
            ;
    }
}